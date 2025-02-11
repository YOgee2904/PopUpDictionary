; filepath: /C:/Workspace/Pop up dictionary/installer.iss
[Setup]
AppName=PopUpDictionary
AppVersion=1.0.0
DefaultDirName={pf}\PopUpDictionary
DefaultGroupName=PopUpDictionary
OutputDir=.
OutputBaseFilename=PopUpDictionaryInstaller
SetupIconFile=assets\icon.ico
Compression=lzma
SolidCompression=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "startup"; Description: "Run PopUpDictionary at startup"; GroupDescription: "Startup"; Flags: unchecked

[Files]
Source: "release-builds\PopUpDictionary-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\PopUpDictionary"; Filename: "{app}\PopUpDictionary.exe"
Name: "{commondesktop}\PopUpDictionary"; Filename: "{app}\PopUpDictionary.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\PopUpDictionary.exe"; Description: "{cm:LaunchProgram,PopUpDictionary}"; Flags: nowait postinstall skipifsilent shellexec

[Registry]
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName: "PopUpDictionary"; ValueData: "{app}\PopUpDictionary.exe"; Tasks: startup

[UninstallDelete]
Type: files; Name: "{app}\*"
Type: filesandordirs; Name: "{app}"
