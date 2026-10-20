import { autorun } from "mobx";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "@/api/auth";
import { authStore } from "@/store/AuthStore";

const StyledHeader = styled("header")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "1rem",
  padding: "1rem",
  backgroundColor: "#0f172a",
  color: "#ffffff",
  borderBottom: "1px solid #1e293b",
});

const Logo = styled("div")({
  fontWeight: 700,
  fontSize: "1.125rem",
});

const Nav = styled("nav")({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
});

const UserName = styled("span")({
  fontWeight: 600,
  color: "#93c5fd",
});

const UserMenu = styled("div")({
  position: "relative",
});

const UserButton = styled("button")({
  border: 0,
  padding: 0,
  background: "none",
  color: "#93c5fd",
  font: "inherit",
  fontWeight: 600,
  cursor: "pointer",
});

const LogoutButton = styled("button")({
  position: "absolute",
  top: "calc(100% + 0.5rem)",
  right: 0,
  zIndex: 1,
  whiteSpace: "nowrap",
  padding: "0.6rem 0.8rem",
  border: "1px solid #334155",
  borderRadius: "0.4rem",
  backgroundColor: "#0f172a",
  color: "#ffffff",
  cursor: "pointer",
});

const StyledLink = styled(Link)({
  color: "inherit",
  textDecoration: "none",
  transition: "color 0.2s ease-in-out",
  "&:hover": {
    color: "#60a5fa",
  },
});

export const Header = () => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [authState, setAuthState] = useState(() => ({
    isAuthenticated: authStore.isAuthenticated,
    isInitializing: authStore.isInitializing,
    displayName: authStore.user?.displayName ?? null,
  }));

  useEffect(
    () =>
      autorun(() => {
        setAuthState({
          isAuthenticated: authStore.isAuthenticated,
          isInitializing: authStore.isInitializing,
          displayName: authStore.user?.displayName ?? null,
        });
      }),
    [],
  );

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      await logoutUser();
      authStore.clearAuth();
      setIsUserMenuOpen(false);
      navigate("/login");
    } catch (error: unknown) {
      setLogoutError(
        error instanceof Error ? error.message : "Не удалось выйти из аккаунта.",
      );
    }
  };

  return (
    <StyledHeader>
      <Logo>Moderation App</Logo>
      <Nav>
        <StyledLink to="/">Главная</StyledLink>
        {!authState.isAuthenticated && !authState.isInitializing && (
          <StyledLink to="/login">Войти</StyledLink>
        )}
        <StyledLink to="/forms">Список форм</StyledLink>
        {authState.displayName && (
          <UserMenu>
            <UserButton
              type="button"
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              onClick={() => setIsUserMenuOpen((open) => !open)}
            >
              <UserName>{authState.displayName}</UserName>
            </UserButton>
            {isUserMenuOpen && (
              <LogoutButton type="button" role="menuitem" onClick={handleLogout}>
                Выйти из аккаунта
              </LogoutButton>
            )}
            {logoutError && <span role="alert">{logoutError}</span>}
          </UserMenu>
        )}
      </Nav>
    </StyledHeader>
  );
};

export default Header;
