#  BeleidsmedewerkerJS
Currently, intended/build for single server use.

## Architecture
Elaborates on several parts of the BeleidsmedewerkerJS architecture

<details>
<summary>Source architecture</summary>

The source folder contains the projects most important files.
Including but not limited to : events, handlers and triggers

#### Folder types
> **Callable** folders contain files that should be
> (and/or) can be used by other parts of the program

> **Triggered** folders contain files that should be
>  called or triggered. These are generally executables

| Folder   | Callable | Triggered |
|----------|----------|-----------|
| Commands | ❌        | ✅         |
| Events   | ❌        | ✅         |
| Cogs     | ❌        | ❌         |
| Handler  | ✅        | ❌         |

#### Layout & Context
```js
/src/
    /** 
     * => Controller file of the project
     * main.js is responsible for the main functionality of the project.
     * It initialises and sets up the client||shard
     * And handles all the logic
     */
    /main.js
        
    /**
     * Cogs (gears) are execute on run scripts.
     * They become and stay available/running on application start.
     * Generally not meant to be called. Service as is
     * 
     * Example
     * - Application Proggramming Interface (API)
     * - x time passed event
     */
    /cogs/
    /**
     * Commands are trigers that are executed on a command (by user)
     * Listeneners are created on application start up.
     * 
     * - data {SlashCommandBuilder}
     * SlashCommandBuilder object 
     * context for creating/registering and utilising slash commands
     *
     * - execute {function|Promise
     * The function to execute on trigger
     */
    /commands/

    /**
     * Events are triggered by the application.
     * Listeners are created on application on start up.
     * Events are triggered by user/channel/guild/bot/etc.
     * So not directly by users request/command
     * 
     * - execute {function|Promise}
     * The function to execute on trigger
     * 
     * - once {boolean}
     *  If the event should only be run once
     * 
     *  Example : ready event should only be run once since the client will only become ready once
     *  
     */
    /events/

    /**
     * Handlers are common functions that can be used by multiple events.
     * In various use cases. Not limited to one.
     * 
     * Example
     * - getting database information
     * - sending out messages to configured channels
     */
    /handlers/
```
</details>