import React, { useEffect, useState, Suspense, useRef, useMemo } from 'react'

import * as THREE from 'three'

import { Canvas, useLoader, useFrame, useThree, extend } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import styled from 'styled-components';

import { softShadows } from "@react-three/drei"

import gltf from './resources/gltf/lightTest_000.glb'

const Wrapper = styled.div`
  position: relative;
  height:100vh;
  width: 100vw;
  background: rgba(170,170,170,1);
  overflow: hidden;
`;

//you can apply the mapping Blender (x,y,z) -> glTF(x,z,-y)
//Blender跟gltf的世界座標軸 mapping (x,y,z) -> glTF(x,z,-y)
//Light跟Light_Orientation，Light_Orientation是因為blender匯出gltf坐標軸不同產生的

// Set receiveShadow on any mesh that should be in shadow,
// and castShadow on any mesh that should create a shadow.

softShadows({
  frustrum: 3.75, // Frustrum width (default: 3.75)
  size: 0.4, // World size (default: 0.005)
  near: 9.5, // Near plane (default: 9.5)
  samples: 17, // Samples (default: 17)
  rings: 11, // Rings (default: 11)
})

const LightTest = ()=> {

  const lightGltf = useLoader(GLTFLoader, gltf, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.decoderPath = '/draco-gltf/'
    loader.setDRACOLoader(dracoLoader)
  })
  const group = useRef();

  
  //spot light
  const light0 = useMemo(() => new THREE.SpotLight(), [])
  const light1 = useMemo(() => new THREE.SpotLight(), [])
  const light2 = useMemo(() => new THREE.SpotLight(), [])

  //directional light
  const dirLight0 = useMemo(() => new THREE.DirectionalLight(), [])

  const light2Target = useRef(null)
  const [light2TargetPos, setLight2TargetPos] = useState([0,0,0])

  const nodes = lightGltf.nodes

  console.log(nodes)

  useEffect(() => {
    console.log(light2Target.current)
    setLight2TargetPos(light2Target.current.position)
  }, [])

  return (
    <group
      ref={group}
    >
      <mesh
        geometry={nodes.Plane.geometry}
        material={nodes.Plane.material}
        position={[0,-13.245,0]}
        castShadow 
        receiveShadow
      />
      <mesh
        geometry={nodes.Cube.geometry}
        material={nodes.Cube.material}
        position={[0,-10.043,6.9991]}
        castShadow 
        //receiveShadow
      />
      <mesh
        geometry={nodes.Cube001.geometry}
        material={nodes.Cube001.material}
        position={[-9.801, -10.043,6.9991]}
        castShadow 
        //receiveShadow
      />
      <mesh
        geometry={nodes.Cube002.geometry}
        material={nodes.Cube002.material}
        position={[9.5795, -10.043,6.9991]}
        castShadow 
        //receiveShadow
      />
      <mesh
        geometry={nodes.Cube003.geometry}
        material={nodes.Cube003.material}
        position={[0, -10.043, -6.7244]}
        castShadow 
        //receiveShadow
      />
      <mesh
        geometry={nodes.Cube004.geometry}
        material={nodes.Cube004.material}
        position={[-9.801, -10.043, -6.7244]}
        castShadow 
        //receiveShadow
      />
      <mesh
        ref={light2Target}
        geometry={nodes.Cube005.geometry}
        material={nodes.Cube005.material}
        position={[9.5795,-10.043,-6.7244]}
        castShadow 
        //receiveShadow
      />

      {/*pointLight*/}
      <pointLight
        position={[nodes.Point.position.x,10,nodes.Point.position.z]}
        color={nodes.Point.children[0].color}
        intensity={3}
        distance={30}
        decay={2}
        castShadow
      />

      <pointLight
        position={nodes.Point001.position}
        color={nodes.Point001.children[0].color}
        intensity={0.1}
        distance={30}
        decay={2}
        castShadow
      />

      <pointLight
        position={nodes.Point002.position}
        color={nodes.Point002.children[0].color}
        intensity={0.1}
        distance={30}
        decay={2}
        castShadow
      />

      {/*spotLight*/}
      <primitive 
        object={light0}
        position={nodes.Spot.position}
        color={nodes.Spot.children[0].color}
        distance={nodes.Spot.children[0].distance}
        penumbra={nodes.Spot.children[0].penumbra}
        angle={nodes.Spot_Orientation.angle}
        intensity={2}
        decay={2}
        castShadow
      />
      <primitive 
        object={light0.target}
        position={[nodes.Spot.position.x,nodes.Spot.position.y-1,nodes.Spot.position.z]}
      />
      
      <primitive 
        object={light1}
        position={nodes.Spot001.position}
        color={nodes.Spot001.children[0].color}
        distance={nodes.Spot001.children[0].distance}
        penumbra={nodes.Spot001.children[0].penumbra}
        angle={nodes.Spot001_Orientation.angle}
        intensity={2}
        decay={2}
        castShadow
      />
      <primitive 
        object={light1.target}
        position={[nodes.Spot001.position.x,nodes.Spot001.position.y-1,nodes.Spot001.position.z]}
      />

      <primitive 
        object={light2}
        position={nodes.Spot002.position}
        color={nodes.Spot002.children[0].color}
        distance={nodes.Spot002.children[0].distance}//Default is 0 (no limit)
        penumbra={nodes.Spot002.children[0].penumbra}//values between zero and 1. Default is zero.
        angle={nodes.Spot002_Orientation.angle}//upper bound is Math.PI/2
        intensity={2}//Default is 1
        decay={2}
        castShadow
        shadow-mapSize-height={1024/50}//試試1024/500~1024
        shadow-mapSize-width={1024/50}//試試1024/500~1024
        shadow-bias={0.02}//試試0.01~0.07
        shadow-focus={1.1}//試試0.1~2
      />
      <primitive 
        object={light2.target}
        position={light2TargetPos}
      />
      

      {/*DirectionalLight*/}
      <primitive 
        object={dirLight0}
        position={nodes.Sun.position}
        color={nodes.Sun.children[0].color}
        intensity={0.05}
        decay={2}
        castShadow
      />
      <primitive 
        object={dirLight0.target}
        position={[nodes.Sun.position.x,nodes.Sun.position.y-1,nodes.Sun.position.z]}
      />

    
    </group>
  )
}

extend({ OrbitControls })
const Controls = (props) => {
  const { gl, camera } = useThree()
  const ref = useRef()
  useFrame(() => ref.current.update())
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />
}

function App() {
  return (
      <Wrapper>
        <Canvas
          camera={{ position: [0, 0, 40] , fov:50}}
          shadowMap
          colorManagement
        >
          <Controls
            //autoRotate
            enablePan={true}
            enableZoom={true}
            enableDamping
            dampingFactor={0.5}
            rotateSpeed={1}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          
          <pointLight 
            position={[0,10,0]}
            intensity={0}
          />

          <Suspense fallback={null}>
            <LightTest/>
          </Suspense>

        </Canvas>
      </Wrapper>
  );
}

export default App;
