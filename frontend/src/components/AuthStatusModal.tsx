import styled from "@emotion/styled";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 12, 26, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalCard = styled.div`
  width: min(100%, 400px);
  padding: 24px;
  background: #141121;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  text-align: center;
`;

const Title = styled.h3`
  margin: 0 0 12px;
  font-size: 18px;
  color: #f4f0ff;
`;

const Text = styled.p`
  margin: 0 0 20px;
  font-size: 14px;
  color: #a6a0b5;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  background: #00e5b4;
  color: #0f0c1a;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

interface AuthStatusModalProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function AuthStatusModal({
  open,
  title,
  message,
  onClose,
}: AuthStatusModalProps) {
  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Text>{message}</Text>
        <ActionButton onClick={onClose}>Понятно</ActionButton>
      </ModalCard>
    </Overlay>
  );
}
