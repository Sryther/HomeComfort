import {Stack} from "@mui/material";
import {Component} from "react";

import './AbstractContainer.css';

interface IAbstractContainerProps {}
interface IAbstractContainerState {
    devices: any[]
}

abstract class AbstractContainer<IProps extends IAbstractContainerProps, IState extends IAbstractContainerState> extends Component<IProps, IState> {
    state: any = {
        devices: []
    }

    constructor(props: IProps) {
        super(props);
    }

    abstract renderDevice(device: any): any;
    abstract getData(): Promise<any>;

    async componentDidMount() {
        try {
            const { data } = await this.getData();
            if (!data || data.length === 0) throw new Error(
                `[${this.constructor.name}] No devices found for this type of device.`
            )
            this.setState({
                devices: data
            });
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Stack className="container" direction="row" sx={{ width: '100%', display: 'flex' }}>
                {this.state.devices.map(this.renderDevice)}
            </Stack>
        )
    }
}

export default AbstractContainer;
