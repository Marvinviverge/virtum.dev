// Version affichée sur le site et noms des fichiers de la release.
// À mettre à jour à chaque release publiée de Marvinviverge/virtum.
export const VERSION = '1.1.0'

export const REPO = 'https://github.com/Marvinviverge/virtum'
export const RELEASES = `${REPO}/releases`
export const LATEST = `${RELEASES}/latest`
export const RELEASE_TAG = `${RELEASES}/tag/v${VERSION}`

const download = (file: string) => `${RELEASES}/download/v${VERSION}/${file}`

export const DEB = `virtum_${VERSION}_amd64.deb`
export const TARBALL = `virtum-${VERSION}-x86_64-linux.tar.gz`
export const TARBALL_DIR = `virtum-${VERSION}-x86_64-linux`

export const DEB_URL = download(DEB)
export const TARBALL_URL = download(TARBALL)
export const SUMS_URL = download('SHA256SUMS')
