import { useEffect } from "react";
import styled from "@emotion/styled";

const Notice = styled.div<{ isError?: boolean }>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 300px;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid
    ${({ isError }) =>
      isError ? "rgba(255, 107, 125, 0.3)" : "rgba(0, 229, 180, 0.3)"};
  background: #141121;
  color: ${({ isError }) => (isError ? "#ff8794" : "#00e5b4")};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Message = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #f4f0ff;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: #a6a0b5;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 2px;
  transition: color 0.2s ease;

  &:hover {
    color: #f4f0ff;
  }
`;

type AuthToastProps = {
  open: boolean;
  message: string;
  isError?: boolean;
  onClose: () => void;
  duration?: number;
};

export function AuthToast({
  open,
  message,
  isError = false,
  onClose,
  duration = 4000,
}: AuthToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <Notice isError={isError}>
      <Content>
        <span>{isError ? "✕" : "✓"}</span>
        <Message>{message}</Message>
      </Content>
      <CloseButton aria-label="Закрыть" onClick={onClose}>
        ✕
      </CloseButton>
    </Notice>
  );
}
