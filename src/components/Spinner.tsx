import { CSSProperties } from "react";
import GridLoader from "react-spinners/GridLoader";

const override: CSSProperties = {
    display: "block",
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

const Spinner = () => {
    return (
        <>
            <GridLoader color={'#00b222'} cssOverride={override} size={20} margin={10} />
        </>
    )
}

export default Spinner