import staricon from "../assets/herosection/staricon.svg";
const CommonLogo = () => {
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
    </div>
  );
};

export default CommonLogo;
