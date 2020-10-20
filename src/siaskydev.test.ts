import { SkynetClient } from "./client";
import { FileType, FileID, User, SkyFile } from "./skydb";
import { Buffer } from "buffer";
import { promiseTimeout, randomNumber, readData } from "./utils";
import { RegistryValue } from ".";
import { HashFileID, HashRegistryValue } from "./crypto";

const client = new SkynetClient("https://siasky.dev");

const appID = "HelloWorld";
const filename = "hello.txt";
const fileID = new FileID(appID, FileType.PublicUnencrypted, filename);

// skip - used to verify end-to-end flow
describe.skip("siasky.dev end to end", () => {
  it("to update the file in the SkyDB", async () => {
    const user = new User("john.doe@gmail.com", "test1234");
    const file = new File(["thisistext"], filename, { type: "text/plain" });

    // set the file in the SkyDB
    const updated = await client.setFile(user, fileID, new SkyFile(file));
    expect(updated).toBe(true);

    // get the file in the SkyDB
    const actual = await client.getFile(user, fileID);

    // assert the contents of that file
    const text = await readData(actual.file);
    const parts = text.toString().split(",");
    expect(parts.length).toBe(2);
    const buf = Buffer.from(parts[1], "base64");
    expect(buf.toString("ascii")).toEqual("thisistext");
  });

  it("support rev number update higher than 255", async () => {
    // create a random user
    const rand = randomNumber(0, 1e6);
    const user = new User(`john.doe+${rand}@gmail.com`, "test1234");

    // verify there is no entry
    let existing = null;
    try {
      existing = await promiseTimeout(client.lookupRegistry(user, fileID), 1e4);
    } catch (error) {
      // expected
    }
    expect(existing).toBeNull();

    // build the registry value
    const skylink = "CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg";

    // update the registry in a loop
    for (let revision = 0; revision <= 260; revision += 10) {
      // calculate the registry value and sign it
      const value: RegistryValue = {
        tweak: HashFileID(fileID),
        data: skylink,
        revision,
      };
      const signature = user.sign({ message: HashRegistryValue(value) });

      // update the registry entry
      const updated = await client.updateRegistry(user, fileID, { value, signature });
      expect(updated).toBe(true);
    }

    // verify the revision in the registry
    const entry = await client.lookupRegistry(user, fileID);
    expect(entry.value.revision).toBeGreaterThan(255);
  });
});
