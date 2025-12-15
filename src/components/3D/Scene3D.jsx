import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import MathScene from "./MathScene";
import PhysicsScene from "./PhysicsScene";
import ChemistryScene from "./ChemistryScene";
import EnglishScene from "./EnglishScene";
import ScienceScene from "./ScienceScene";

const Scene3D = ({ subject = "math" }) => {
  const getScene = () => {
    switch (subject.toLowerCase()) {
      case "mathematics":
      case "math":
        return <MathScene />;
      case "physics":
        return <PhysicsScene />;
      case "chemistry":
        return <ChemistryScene />;
      case "english":
        return <EnglishScene />;
      case "science":
        return <ScienceScene />;
      default:
        return <MathScene />;
    }
  };

  return (
    <Canvas
      style={{
        width: "100%",
        height: "100%",
      }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.2}
      />
      {getScene()}
    </Canvas>
  );
};

export default Scene3D;



