import React from 'react'
import ChangeGroup from "components/ChangeGroup"
import {bindPopover, bindToggle, usePopupState} from 'material-ui-popup-state/hooks'
import IconButton from "@material-ui/core/IconButton"
import SettingsIcon from "@material-ui/icons/Settings"
import Tooltip from "@material-ui/core/Tooltip"
import Popover from '@material-ui/core/Popover'


export function UserSettings() {
    const popupState = usePopupState({
        variant: 'popover',
        popupId: 'demoPopover',
    })

    return (
        <div>
            <Tooltip title="Settings">
                <IconButton {...bindToggle(popupState)}>
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
            <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <ChangeGroup/>
            </Popover>
        </div>
    )
}
