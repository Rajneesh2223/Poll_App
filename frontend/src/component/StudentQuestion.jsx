import staricon from "../assets/herosection/staricon.svg";
const StudentQuestion = () => {

    return (
        <div>
            <div className="flex justify-center">
                <button
                    className="px-2.5 py-1.5 rounded-3xl"
                    style={{
                        background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
                    }}
                >
                    <div className="flex items-center space-x-2">
                        <img src={staricon} alt="star icon" className="w-6 h-6" />
                        <h1 className="font-sora font-semibold text-white text-lg">
                            Intervue Poll
                        </h1>
                    </div>
                </button>
            </div>

            <p className="text-center font-sora font-semibold text-xl">
            Wait for the teacher to ask questions..
            </p>

        </div>
    )
}

export default StudentQuestion