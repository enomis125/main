import { Spinner } from "@nextui-org/react";


function Loader() {
    return (
        <div className="flex w-full -my-16 h-screen justify-center items-center top-0 bg-white overflow-clip">
            <Spinner size="lg" label="A Carregar..." />
        </div>
    );
}
export default Loader;