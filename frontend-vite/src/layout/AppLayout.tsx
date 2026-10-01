// import { Outlet } from "react-router-dom";
// import Header from "@/components/Header";

// export function AppLayout() {
//   return (
//     <>
//       <Header />
//       <main>
//         <Outlet />
//       </main>
//     </>
//   );
// }
import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #0f0c1a;
  display: flex;
  flex-direction: column;
`;

export function AppLayout() {
  return (
    <LayoutContainer>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </LayoutContainer>
  );
}
