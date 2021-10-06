import React from 'react'
import {
    Drawer
} from '@material-ui/core'
export default function SideDrawer({ open, close }) {
    return (
        <div>
            <Drawer
                anchor={'right'}
                open={open}
                onClose={close}
            >
                Hello
            </Drawer>
        </div>
    )
}
