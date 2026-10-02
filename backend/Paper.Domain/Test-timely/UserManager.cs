using Paper.Domain.Models.User;
using Paper.Domain.Test_timely.Managers;
using Paper.Domain.Test_timely.Options;
using Paper.Domain.Test_timely.UserFilter;

namespace Paper.Domain.Test_timely.UserManager;

public class UserManager
{

    private int StartId, DefaultId = 0;

    public int Id
    {
        get
        {
            return StartId;
        }


        private set
        {
            StartId = value;
        }
    }

    private readonly JsonManager<List<UserInfo>> _jsonManager;
    private readonly JsonManager<OptionsManager> _settingsReader;

    private readonly string _FolderSave = "Data\\";
    private readonly string _pathSaveFile = $"Users.json";
    private readonly string _pathOptionsFile = "Settings.json";

    public bool IsCanReload = true;

    public List<UserInfo> Users { get; private set; }


    public void LoadFromFile()
    {
        if (!IsCanReload)
            return;


        List<UserInfo>? users = _jsonManager.Read();

        if (users == null || users.Count == 0)
            return;

        Users = users;


        OptionsManager? optionsManager = _settingsReader.Read();

        if (optionsManager == null)
            return;

        StartId = optionsManager.StartId;
    }


    public UserManager(int? _id = null)
    {

        _pathSaveFile = _FolderSave + _pathSaveFile;
        _pathOptionsFile = _FolderSave + _pathOptionsFile;

        _jsonManager = new(_pathSaveFile);
        _settingsReader = new(_pathOptionsFile);


        if (FileManager.Exist(_pathSaveFile))
        {
            LoadFromFile();
            return;
        }


        StartId = _id ?? DefaultId;
        Users = [];
    }






    public int AddUser(UserInfo user)
    {
        user.Id = StartId;
        StartId++;

        Users.Add(user);
        return user.Id;
    }

    public int AddUser(string email, string password)
    {
        UserInfo user = new()
        {
            Email = email,
            Password = password
        };
        return AddUser(user);
    }

    public UserInfo? GetUser(UserFilterTake filter)
    {

        if (filter.Id != UserFilterTake.DefaultNullId)
        {

            foreach (UserInfo user in Users)
            {
                if (user.Id == filter.Id) return user;
            }


        }

        if (filter.Email != UserFilterTake.DefaultNull)
        {


            foreach (UserInfo user in Users)
            {
                if (user.Email == filter.Email) return user;
            }

        }

        if (filter.Password != UserFilterTake.DefaultNull)
        {


            foreach (UserInfo user in Users)
            {
                if (user.Password == filter.Password) return user;
            }

        }


        return null;

    }



    public void SynsSaveData()
    {
        _jsonManager.Write(Users);
        _settingsReader.Write(new OptionsManager { StartId = Id});
    }




}
