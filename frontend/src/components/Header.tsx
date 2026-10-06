import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const StyledHeader = styled("header")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
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
  gap: "1rem",
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
  return (
    <StyledHeader>
      <Logo>Moderation App</Logo>
      <Nav>
        <StyledLink to="/">Главная</StyledLink>
        <StyledLink to="/login">Логин</StyledLink>
        <StyledLink to="/forms">Список форм</StyledLink>
      </Nav>
    </StyledHeader>
  );
};

export default Header;