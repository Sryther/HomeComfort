import {Stack} from "@mui/material";
import {Component} from "react";

import './AbstractContainer.css';

interface IAbstractContainerProps {}
interface IAbstractContainerState {
    data: any[]
}

abstract class AbstractContainer<IProps extends IAbstractContainerProps, IState extends IAbstractContainerState> extends Component<IProps, IState> {
    state: any = {
        data: []
    }

    constructor(props: IProps) {
        super(props);
    }

    abstract renderDevice(data: any): any;
    abstract getData(): Promise<any>;
    abstract getName(): string;

    async componentDidMount() {
        try {
            const { data } = await this.getData();
            if (!data || data.length === 0) {
                this.setState({ data: [] });
                throw new Error(
                    `[${this.getName()}] No devices found for this type of device.`
                )
            }
            this.setState({ data });
        } catch(error) {
            console.error(error);
        }
    }

    render() {
        return (
            <Stack className="container" direction="row" sx={{ width: '100%', display: 'flex' }}>
                {this.state.data.map(this.renderDevice)}
            </Stack>
        )
    }
}

export default AbstractContainer;
