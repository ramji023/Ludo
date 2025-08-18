import { Form } from "../components/ui/Form";
export default function GamePage() {
  return (
    <>
      <div className="h-screen w-screen relative">
        <img src="/ludo-bg.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex justify-center items-center">
          <Form />
        </div>
      </div>
    </>
  );
}
