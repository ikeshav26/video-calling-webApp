class PeerService {
    constructor() {
        if (!this.peer) {
            this.peer = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478",
                        ],
                    },
                ],
            });
        }
    }

    async getOffer() {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        return this.peer.localDescription;
    }

    async getAnswer(offer) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);
        return this.peer.localDescription;
    }

    async setRemoteDescription(ans) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }

    async setLocalDescription(desc) {
        await this.peer.setLocalDescription(desc);
    }
}

export default new PeerService();
