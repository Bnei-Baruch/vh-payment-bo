import React from "react";
import { Drawer } from "@material-ui/core";
import styled from "styled-components";
const DrawerContainer = styled.div`
  min-width: 400px;
`
export default function OrdersDrawer({ open, close }) {
  return (
    <div>
      <Drawer anchor={"right"} open={open} onClose={close}>
        <DrawerContainer>
          Orders Drawer
        </DrawerContainer>
      </Drawer>
    </div>
  );
}
