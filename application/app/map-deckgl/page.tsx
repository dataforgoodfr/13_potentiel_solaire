import MapDeckGl from "../components/MapDeckGl";

export default function Home() {
  return (
    <div className="global-margin flex h-screen flex-col items-center justify-center">
      <MapDeckGl height={500} width={500} />
    </div>
  );
}
