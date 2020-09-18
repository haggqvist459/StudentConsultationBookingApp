import React from 'react';
import { TOOL_BUTTON, DESIGN } from '../utils';
import { IconButton, Button, styled } from '@material-ui/core';
import { Edit, ArrowBack } from '@material-ui/icons';
import PropTypes from 'prop-types'

const BlueButton = styled(Button)({
    background: DESIGN.PRIMARY_COLOR,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(0, 174, 179, .3)',
    color: 'white',
    height: 48,
    minWidth: '150px',
    padding: '0 30px',
    margin: '10px',
    '&:hover': {
        backgroundColor: DESIGN.PRIMARY_COLOR,
    }
});

const RedButton = styled(Button)({
    background: DESIGN.BUTTON_RED,
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(0, 174, 179, .3)',
    color: 'white',
    height: 48,
    minWidth: '150px',
    padding: '0 30px',
    margin: '10px',
    '&:hover': {
        backgroundColor: DESIGN.PRIMARY_COLOR,
    }
});

function ToolButton({ type }) {

    switch (type) {
        case TOOL_BUTTON.NEW:
            return (
                <BlueButton>New</BlueButton>
            )
        case TOOL_BUTTON.EDIT:
            return (
                <IconButton>
                    <Edit />
                </IconButton>
            )
        case TOOL_BUTTON.SAVE:
            return (
                <BlueButton>Save</BlueButton>
            )
        case TOOL_BUTTON.DELETE:
            return (
                <RedButton>Delete</RedButton>
            )
        case TOOL_BUTTON.RETURN:
            return (
                <IconButton>
                    <ArrowBack />
                </IconButton>
            )
        default:
            break;
    }
}

ToolButton.propTypes = {
    type: PropTypes.string.isRequired,
}

export { ToolButton };
