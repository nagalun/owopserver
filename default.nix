{ nixpkgs ? import <nixpkgs> {  } }:
with nixpkgs; stdenv.mkDerivation rec {
	name = "owopserver";

	src = fetchGit {
		url = ./.;
	};

	serverRuntime = pkgs.nodejs_22;
	nativeBuildInputs = [
		yarnConfigHook
		#npmHooks.npmInstallHook
	];

	yarnOfflineCache = fetchYarnDeps {
		yarnLock = "${src}/yarn.lock";
		hash = "sha256-Q5Y3JMvwVZEzHtHUXqKvYavgZVzW/6PqVmuV0xj7ipA=";
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
exec ${serverRuntime}/bin/node '$out/libexec/${name}/src/index.js';
EOF
		chmod a+x $out/bin/${name}
	'';

	meta = {
		description = "A Node.js server for the Ourworldofpixels client, designed for performance";
		homepage = "https://github.com/LapisHusky/owopserver";
		platforms = lib.platforms.linux;
	};
}
