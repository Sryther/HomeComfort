import React from "react";

export interface IAbstractDeviceState {
    isMenuOpen: boolean,
    isLoading: boolean
}

abstract class AbstractDevice<IProps, IState extends IAbstractDeviceState> extends React.Component<IProps, IState> {
    menuAnchorEl: any;
    refreshDataHandle?: NodeJS.Timer;
    isRefreshDataRunning: boolean = false;
    state: any = {
        isMenuOpen: false,
        isLoading: false
    };

    protected constructor(props: any) {
        super(props);
        this.menuAnchorEl = null;
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

    openMenu(event: React.MouseEvent<HTMLButtonElement>) {
        this.menuAnchorEl = event.currentTarget;
        this.setState({ isMenuOpen: true });
    }

    closeMenu() {
        this.setState({ isMenuOpen: false });
    }
}

export default AbstractDevice;
