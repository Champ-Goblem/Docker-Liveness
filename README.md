# Docker-Liveness
Simple CMD liveness image

Adds a new file `/liveness-file` and leaves it there for 180 seconds, then deletes the file so that subsequent liveness probes fail. A liveness probe can be setup to `cat /liveness-file`.
