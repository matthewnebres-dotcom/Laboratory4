# Laboratory 4 - TaskFlow

This project is based on the original Laboratory 3 TaskFlow project. It keeps the original interface and task/group workflow, adds Zustand for shared task and group state, and adds Axios for retrieving sample user information from DummyJSON.

## Requirements
- Node.js (LTS recommended)
- Internet connection to retrieve DummyJSON user information

## Install and run
Open this folder in VS Code, then run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Test
- Create two groups from Groups.
- Open a group and add a task.
- Mark it Done and Not Done, then delete it.
- Return to Dashboard and check the task counts.
- Open User Information to see the Axios/DummyJSON response.
- Disconnect the internet or use an invalid API endpoint temporarily to test the error message and retry button. Restore the correct endpoint afterward.

## Build
```bash
npm run build
npm run preview
```

## GitHub Pages deployment
The Vite base and BrowserRouter basename are configured for a repository named `Laboratory4`.

1. Create a public GitHub repository named `Laboratory4`.
2. In this folder, open terminal and run:
   ```bash
   git init
   git add .
   git commit -m "Laboratory 4 TaskFlow"
   git branch -M main
   git remote add origin https://github.com/matthewnebres-dotcom/Laboratory4.git
   git push -u origin main
   ```
3. Run:
   ```bash
   npm run deploy
   ```
4. In GitHub repository Settings > Pages, choose Deploy from a branch, select `gh-pages` and `/ (root)`, then Save.

Expected URL:
https://matthewnebres-dotcom.github.io/Laboratory4/

If the repository already has a remote, do not run `git remote add origin` again. Check it with `git remote -v`; update it only if it points to the wrong repository.

## Notes
- Task and group data are held in Zustand in memory. They are shared across pages while the app is running, but they reset after a full page refresh. No persistence was added because it was not requested in the supplied instructions.
- DummyJSON is used only for sample user information. Tasks and groups are not fetched from the API.
- The Developers page lists Matthew Nebres as the solo developer.
