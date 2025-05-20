{ nixpkgs ? import <nixpkgs> {  } }:
with nixpkgs; stdenv.mkDerivation rec {
	name = "owopserver";

	src = fetchGit {
		url = ./.;
	};

	serverRuntime = pkgs.nodejs_18;
	nativeBuildInputs = [
		yarnConfigHook
		#npmHooks.npmInstallHook
	];

	yarnOfflineCache = fetchYarnDeps {
		yarnLock = "${src}/yarn.lock";
		hash = "sha256-TlNP8QaLcD/rQ8+U41gCBE45RDCU/ueNfrGrz+qgZz8=";
	};

	# Grab the dependencies for running later
	buildPhase = ''
		mkdir -p $out/bin $out/libexec/${name}
		cp package.json $out/libexec/${name}/
		cp -r node_modules $out/libexec/${name}/
		cp -r src $out/libexec/${name}/
	'';

	# Write a script to the output folder that invokes the entrypoint of the application
	installPhase = ''
		cat <<EOF > $out/bin/${name}
#!/bin/sh
${serverRuntime}/bin/node '$out/libexec/${name}/src/index.js';
EOF
		chmod a+x $out/bin/${name}
	'';

	meta = {
		description = "A Node.js server for the Ourworldofpixels client, designed for performance";
		homepage = "https://github.com/LapisHusky/owopserver";
		platforms = lib.platforms.linux;
	};
}
