# Eventio

Eventio is a sample interview app. In Eventio you can create, edit, join, leave events of any kind.

## Running the app

```bash
npm i
npm start
```

## What has been implemented

- Basic structure of the app + navigation using React Router (It was painful!)
- SignIn flow with both SignIn and SignUp screen
- Persistent auth storage that stores current session
- Bottom tab navigator with event and profile tab
- Joining/Leaving event functionality
- Create event page + functionality
- Edit event page + functionality
- Edit profile page - no functionality (I didn't see such endpoint)
- Many custom components - Text, TextInput, DateTimeInput

## What has NOT been implemented - What needs to be done

- Test on Android - my Phone refused to cooperate and Android Studio likewise :(
- KeyboardAvoidingView is misbehaving in SignIn flow covering button- needs some fix
- Hook up edit profile screen to api once the endpoint is ready
- Displaying loading and error state is inconsistent (Event screen - activity indicator only in place of event list; Profile screen - activity indicator in place of whole screen

## Caveats

Because of explainable ways of how expo-router works there are some ugly workarounds in \_layout.tsx file in the root of the project. This was done in order to protect my sanity since there is a super weird bug which I can tell you about later.
