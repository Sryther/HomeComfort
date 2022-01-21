import {Component} from "react";
import ReactTooltip from "react-tooltip";

interface IAirComponentProps {
    id: string,
    name: string,
    ip4?: string,
    ip6?: string
}

class AirComponent extends Component<IAirComponentProps> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div>
                <h4 data-tip="" data-for={this.props.id + "-" + this.props.name} >{this.props.name}</h4>
                <ReactTooltip place="top" type="dark" effect="solid" id={this.props.id + "-" + this.props.name}>
                    <p>{this.props.ip4 || this.props.ip6}</p>
                </ReactTooltip>
            </div>
        );
    }
}

export default AirComponent;
