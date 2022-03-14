import React from "react";
import {Box, Button, Divider, Menu, MenuItem, Modal, TextField} from "@mui/material";
import * as uuid from "uuid";
import _ from "lodash";

export interface IAbstractDeviceState {
    isMenuOpen: boolean,
    isLoading: boolean,
    isDeviceInformationModalOpen: boolean,
    deviceInformation: string
}

abstract class AbstractDevice<IProps, IState extends IAbstractDeviceState> extends React.Component<IProps, IState> {
    menuAnchorEl: any;
    refreshDataHandle?: NodeJS.Timer;
    isRefreshDataRunning: boolean = false;

    updateDeviceInformationItem: JSX.Element;

    state: any = {
        isMenuOpen: false,
        isLoading: false,
        isDeviceInformationModalOpen: false,
        deviceInformation: ""
    };

    protected constructor(props: any) {
        super(props);
        this.menuAnchorEl = null;
        this.updateDeviceInformationItem = (
            <MenuItem key={uuid.v4()} onClick={async () => this.openDeviceInformationModal.bind(this)()}>
                Editer l'équipement
            </MenuItem>
        );
    }

    async componentDidMount() {
        try {
            await this.refreshData();
            this.refreshDataHandle = setInterval(this.refreshData.bind(this), 5000);
        } catch(error) {
            console.error(error);
        }
    }

    componentWillUnmount() {
        if (this.refreshDataHandle) {
            clearTimeout(this.refreshDataHandle);
        }
    }

    abstract refreshData(): Promise<any>;

    openMenu(event: React.MouseEvent<HTMLButtonElement>): void {
        this.menuAnchorEl = event.currentTarget;
        this.setState({ isMenuOpen: true });
    }

    closeMenu(): void {
        this.setState({ isMenuOpen: false });
    }

    async openDeviceInformationModal(): Promise<void> {
        this.closeMenu();
        await this.prepareDeviceInformationModal();
        this.setState({ isDeviceInformationModalOpen: true });
    }

    handleDeviceInformationCloseModal(): void {
        this.setState({ isDeviceInformationModalOpen: false });
    }

    renderMenu(items: Array<JSX.Element> = []): JSX.Element {
        return (
            <Menu
                anchorEl={this.menuAnchorEl}
                open={!_.isNil(this.state) && this.state.isMenuOpen}
                onClose={this.closeMenu.bind(this)}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {items}
                {items.length > 0 ? <Divider key={`divideEdition-${uuid.v4()}`} /> : null}
                {this.updateDeviceInformationItem}
            </Menu>
        );
    }

    renderInformationModal(): JSX.Element {
        let newValue: any = this.state.deviceInformation;
        const handleTextInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
            try {
                newValue = JSON.parse(event.target.value);
            } catch (error: any) {
                newValue = JSON.parse(this.state.deviceInformation);
            }
        };

        return (
            <Modal
                open={this.state.isDeviceInformationModalOpen}
                onClose={this.handleDeviceInformationCloseModal.bind(this)}
            >
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <TextField
                        sx={{"width": "100%"}}
                        id={uuid.v4()}
                        label="Configuration"
                        multiline
                        rows={10}
                        onChange={handleTextInputChange}
                        defaultValue={this.state.deviceInformation}
                    />
                    <Button onClick={async () => {
                        await this.updateDeviceInformation.bind(this)(newValue);
                        this.handleDeviceInformationCloseModal.bind(this)();
                    }}>
                        Sauver
                    </Button>
                    <Button color="secondary" onClick={this.handleDeviceInformationCloseModal.bind(this)}>
                        Fermer
                    </Button>
                </Box>
            </Modal>
        );
    }

    abstract getDeviceInformation(): Promise<any>;
    abstract updateDeviceInformation(data: any): Promise<any>;

    async prepareDeviceInformationModal(): Promise<void> {
        let deviceInfo = await this.getDeviceInformation();

        if (_.isNil(deviceInfo)) {
            deviceInfo = { data: "Error while retrieving device data." };
        }

        delete deviceInfo.data.__v;
        delete deviceInfo.data._id;

        let textValue = JSON.stringify(deviceInfo.data, null, 2);

        this.setState({ deviceInformation: textValue });
    }
}

export default AbstractDevice;
