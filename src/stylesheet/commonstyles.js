import styled from "styled-components";

export const ViewButton = styled.div`
  border: 1px solid #000;
  border-radius: 30px;
  padding: 3px 10px;
  text-align: center;
  cursor: pointer;
`;

export const SucessfulPayment = styled.div`
  color: green;
  font-weight: 800;
`;
export const PendingPayment = styled.div`
  color: orange;
  font-weight: 800;
`;
export const FailedPayment = styled.div`
  color: red;
  font-weight: 800;
`;

export const boxStyle = {
  width: "100%",
  minHeight: 150,
  bgcolor: "#fff",
  "&:hover": {
    backgroundColor: "primary.main",
    opacity: [0.9, 0.8, 0.7],
  },
};
