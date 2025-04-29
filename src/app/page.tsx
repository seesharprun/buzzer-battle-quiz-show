import BuzzerGame from "../components/game/BuzzerGame";
import NumberCanvas from "../components/NumberCanvas";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-screen max-h-screen bg-gray-900 text-white overflow-hidden">
      <header className="p-4 text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-red-500">
          Ultimate Buzzer Battle
        </h1>
        <p className="text-gray-400 mt-2">
          The host starts the round with SPACE, then players buzz in with number keys (0-9)
        </p>
      </header>      
      <main className="flex-1 w-full overflow-hidden">
        <NumberCanvas>
          <BuzzerGame />
        </NumberCanvas>
      </main>
    </div>
  );
}
