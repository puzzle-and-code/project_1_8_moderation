using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;

namespace Paper.Domain.Test_timely.Managers;


// In here you see managers, who can checks, writes and helps me in file system of windows :/

public class FolderManager
{
    static public void CreateFolder(string path) => Directory.CreateDirectory(path);
    static public bool ExistFolder(string path) => Directory.Exists(path);
}

public class FileManager(string path)
{
    public string Path = path;

    static public void Write(string path, string text, bool append = false)
    {
        try
        {
            using StreamWriter writer = new(path, append); writer.Write(text);
        }
        catch (UnauthorizedAccessException ex) { Console.WriteLine($"Access denied to file: {ex.Message}."); }
        catch (IOException ex) { Console.WriteLine($"I/O error while writting to file: {ex.Message}."); }
    }
    static public string? Read(string path)
    {
        try
        {
            if (File.Exists(path)) using (StreamReader reader = new(path)) return reader.ReadToEnd();
        }
        catch (UnauthorizedAccessException ex) { Console.WriteLine($"Access denied to file: {ex.Message}."); }
        catch (IOException ex) { Console.WriteLine($"I/O error while reading to file: {ex.Message}."); }
        Console.WriteLine("File hasn't found!");
        return string.Empty;
    }
    static public void RemoveFile(string path)
    {
        if (File.Exists(path)) File.Delete(path);
    }
    static public string[] GetFiles(string path) => Directory.GetFiles(path);
    static public bool Exist(string path) => File.Exists(path);

    public void Write(string text, bool append = false)
    {
        try
        {
            using StreamWriter writer = new(Path, append); writer.Write(text);
        }
        catch (UnauthorizedAccessException ex) { Console.WriteLine($"Access denied to file: {ex.Message}."); }
        catch (IOException ex) { Console.WriteLine($"I/O error while writting to file: {ex.Message}."); }
    }
    public string? Read()
    {
        try
        {
            if (File.Exists(Path)) using (StreamReader reader = new(Path)) return reader.ReadToEnd();
        }
        catch (UnauthorizedAccessException ex) { Console.WriteLine($"Access denied to file: {ex.Message}."); }
        catch (IOException ex) { Console.WriteLine($"I/O error while reading to file: {ex.Message}."); }
        Console.WriteLine("File hasn't found!");
        return string.Empty;
    }
    public string[] GetFiles() => Directory.GetFiles(Path);
    public void RemoveFile()
    {
        if (File.Exists(Path)) File.Delete(Path);
    }
    public bool Exist() => File.Exists(Path);
}

public class JsonManager<T>
{
    public string Path { get; private set; }
    FileManager FileManager { get; set; }

    static public void Write(T obj, string path) => FileManager.Write(CheckPath(path), JsonSerializer.Serialize(obj, options));
    static public T? Read(string path)
    {
        string? json = FileManager.Read(CheckPath(path));
        return string.IsNullOrEmpty(json) ? default : JsonSerializer.Deserialize<T>(json);
    }
    static public void Remove(string path) => FileManager.RemoveFile(CheckPath(path));
    static public string[] GetFiles(string path) => FileManager.GetFiles(CheckPath(path));
    static public bool Exist(string path) => File.Exists(CheckPath(path));

    static readonly JsonSerializerOptions options = new()
    {
        Encoder = JavaScriptEncoder.Create(UnicodeRanges.BasicLatin, UnicodeRanges.Cyrillic),
        WriteIndented = true
    };

    static string CheckPath(string path)
    {
        if (!path.Contains(".json")) return path.Replace(".", "") + ".json";
        return path;
    }

    public JsonManager(string path)
    {
        path = CheckPath(path);
        FileManager = new FileManager(path);
        Path = path;
    }

    public void Write(T obj) => FileManager.Write(JsonSerializer.Serialize(obj, options));

    public T? Read()
    {
        string? json = FileManager.Read();
        return string.IsNullOrWhiteSpace(json) ? default : JsonSerializer.Deserialize<T>(json);
    }
    public void Remove() => FileManager.RemoveFile();
    public string[] GetFiles() => FileManager.GetFiles();
    public bool Exist() => File.Exists(Path);

    void CheckPath()
    {
        if (!Path.Contains(".json")) Path = Path.Replace(".", "") + ".json";
    }
}

public class Path(string folder, string file)
{
    public string Folder = folder;
    public string File = file;
    public string GetLanguages(char separator = '/') => folder + separator + "languages/";
    public string GetSettings(char separator = '/') => folder + separator + "settings";
    public string GetFullPath(char separator = '/') => Folder + separator + File;
}