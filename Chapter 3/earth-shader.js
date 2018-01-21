// Constructor
EarthApp = function () {
    Sim.App.call(this);
}

// Subclass Sim.App
EarthApp.prototype = new Sim.App();

// Our custom initializer
EarthApp.prototype.init = function (param) {
    // Call superclass init code to set up scene, renderer, default camera
    Sim.App.prototype.init.call(this, param);

    // Create the Earth and add it to our sim
    var earth = new Earth();
    earth.init();
    this.addObject(earth);

    var sun = new Sun()
    sun.init()
    this.addObject(sun)
}

// Custom Earth class
Earth = function () {
    Sim.Object.call(this);
}

Earth.prototype = new Sim.Object();

Earth.prototype.init = function () {

    let earthGroup = new THREE.Object3D()
    this.setObject3D(earthGroup)

    this.createGlobe()
    this.createClouds()

}

Earth.prototype.createGlobe = function () {
    var loader = new THREE.TextureLoader()
    // 创建多重纹理
    var surfaceMap = loader.load("../images/earth_surface_2048.jpg"); //
    var normalMap = loader.load("../images/earth_normal_2048.jpg"); //
    var specularMap = loader.load("../images/earth_specular_2048.jpg"); // 高光贴图
    // var shader = THREE.ShaderUtils.lib["normal"]
   /* var shader = THREE.ShaderLib["normal"];
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms["tNormal"] = {texture: normalMap};
    uniforms["tDiffuse"] = {texture: surfaceMap};
    uniforms["tSpecular"] = {texture: specularMap};

    uniforms["enableDiffuse"] = {
        value: true
    };
    uniforms["enableSpecular"] = {
        value: true
    };

    var shaderMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: uniforms,
        lights: true
    });*/

    var material = new THREE.MeshPhongMaterial({
        map: surfaceMap,
        normalMap: normalMap,
        specularMap: specularMap});

    var globeGeometry = new THREE.SphereGeometry(1, 32, 32);

    // 为着色器计算切线
    // globeGeometry.computeTangents()
    var globeMesh = new THREE.Mesh(globeGeometry, material)

    globeMesh.rotation.x = Earth.TILT;

    this.object3D.add(globeMesh)

    this.globeMesh = globeMesh
}

Earth.prototype.createClouds = function () {
    var loader = new THREE.TextureLoader()
    // 创建云层
    var cloudsMap = loader.load('../images/earth_clouds_1024.png')
    var cloudsMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: cloudsMap, transparent: true});
    var cloudsGeometry = new THREE.SphereGeometry(Earth.CLOUDS_SCALE, 32, 32);
    var cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    cloudsMesh.rotation.x = Earth.TILT;

    this.object3D.add(cloudsMesh);

    this.cloudsMesh = cloudsMesh
}
Earth.prototype.update = function () {
    // "I feel the Earth move..."
    this.globeMesh.rotation.y += Earth.ROTATION_Y;
    this.cloudsMesh.rotation.y += Earth.CLOUDS_ROTATION_Y;

    //？ 加这个是干嘛的？
    // Sim.Object.prototype.update.call(this)
}

Earth.ROTATION_Y = 0.001;
Earth.TILT = 0.41;
Earth.CLOUDS_SCALE = 1.005;
Earth.CLOUDS_ROTATION_Y = Earth.ROTATION_Y * 0.95;

Sun = function () {
    Sim.Object.call(this)
}
Sun.prototype = new Sim.Object()

Sun.prototype.init = function () {
    var light = new THREE.PointLight(0xffffff, 2, 100)
    light.position.set(-10, 0, 20)

    this.setObject3D(light)
}
