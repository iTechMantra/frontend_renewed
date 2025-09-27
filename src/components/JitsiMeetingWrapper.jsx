//src/components/JitsiMeetingWrapper
import { JitsiMeeting } from "@jitsi/react-sdk";

export default function JitsiMeetingWrapper({ roomName, displayName, onEnd }) {
  return (
    <div className="w-full h-[600px] border rounded shadow overflow-hidden">
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: false,
        }}
        interfaceConfigOverwrite={{
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "desktop", "fullscreen",
            "fodeviceselection", "hangup", "chat", "raisehand",
            "tileview", "videobackgroundblur", "download", "help"
          ],
        }}
        userInfo={{
          displayName: displayName,
        }}
        onApiReady={(externalApi) => {
          externalApi.addListener("readyToClose", () => {
            if (onEnd) onEnd();
          });
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "100%";
          iframeRef.style.width = "100%";
        }}
      />
    </div>
  );
}