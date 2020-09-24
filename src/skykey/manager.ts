import { errUnsupportedSkykeyType, cipherType, maxKeyNameLen, typePrivateID, typePublicID, Skykey, skykeyType, skykeyID } from "./skykey";
import * as crypto from "../crypto/crypto";

/**
 * Indicates that the skykey manager doesn't have a key with that ID.
 */
export const errNoSkykeysWithThatID = "No Skykey is associated with that ID";

/**
 * Indicates that the name is too long
 */
const errSkykeyNameToolong = "Skykey name exceeds max length";

/**
 * Indicates that a key cannot be created or added because a key with the same
 * name is already being stored.
 */
const errSkykeyWithNameAlreadyExists = "Skykey name already used by another key";

// TODO: Make the skykey manager part of the client.

export class Skykeymanager {
  idsByName: Map<string, skykeyID>;
  keysByID: Map<skykeyID, Skykey>;

  constructor() {
    // this.keysByID = new Map();
    // this.idsByName = new Map();
    this.testLoadSkykeys()
  }

  /**
   * TODO: Remove. We will be reading skykeys from a file on Skynet.
   */
  testLoadSkykeys() {
    // Hard-code skykeys for now.
    this.keysByID = new Map([
      [46, 227, 121, 225, 164, 23, 114, 121, 167, 176, 123, 168, 158, 128, 22, 209], {Name:"key_to_the_castles", Type:2, Entropy:[57, 15, 139, 25, 180, 225, 126, 250, 105, 166, 54, 203, 121, 3, 80, 66, 0, 210, 70, 190, 77, 50, 34, 43, 126, 224, 120, 207, 245, 51, 160, 24, 110, 1, 129, 115, 201, 110, 161, 197, 252, 255, 186, 142, 107, 114, 199, 175, 10, 83, 53, 227, 246, 70, 174, 49]},
      [89, 21, 234, 52, 215, 155, 83, 122, 56, 133, 128, 172, 23, 158, 9, 204], {Name:"", Type:1, Entropy:[66, 52, 120, 3, 151, 89, 113, 240, 91, 162, 142, 47, 34, 57, 59, 83, 152, 118, 229, 111, 31, 16, 0, 242, 165, 17, 253, 242, 124, 42, 91, 154, 177, 191, 178, 144, 249, 71, 4, 72, 195, 115, 58, 203, 219, 88, 102, 142, 17, 244, 204, 10, 16, 223, 228, 42]},
      [92, 132, 124, 29, 29, 208, 221, 227, 5, 153, 9, 45, 165, 149, 34, 73],{Name:testcreateskykey4, Type:2, Entropy:[34, 249, 62, 13, 80, 239, 245, 8, 211, 23, 250, 158, 126, 205, 155, 25, 219, 9, 251, 152, 196, 160, 57, 203, 93, 5, 144, 215, 237, 164, 186, 104, 38, 101, 208, 29, 55, 36, 127, 47, 223, 145, 210, 243, 146, 131, 216, 104, 31, 80, 71, 155, 48, 30, 250, 45]},
      [164, 144, 15, 61, 245, 164, 89, 122, 108, 179, 112, 111, 48, 48, 137, 11],{Name:testcreateskykey, Type:1, Entropy:[232, 6, 113, 140, 141, 215, 39, 156, 62, 126, 233, 158, 69, 89, 167, 251, 69, 198, 164, 245, 185, 75, 151, 26, 222, 75, 221, 93, 29, 11, 25, 149, 225, 0, 205, 160, 232, 209, 32, 88, 124, 18, 238, 41, 15, 128, 80, 163, 7, 88, 207, 156, 217, 224, 222, 110]},
      [171, 12, 78, 53, 59, 120, 106, 10, 155, 18, 108, 207, 149, 44, 176, 105],{Name:key_to_the_castle2, Type:2, Entropy:[4, 236, 216, 66, 52, 73, 85, 157, 59, 250, 100, 185, 192, 205, 144, 97, 56, 195, 236, 178, 127, 239, 129, 112, 117, 39, 82, 66, 55, 183, 35, 41, 227, 225, 188, 145, 67, 148, 15, 100, 45, 241, 238, 161, 251, 234, 65, 48, 82, 181, 117, 21, 38, 80, 4, 159]},
      [190, 194, 169, 203, 161, 171, 75, 219, 89, 251, 87, 233, 7, 221, 14, 120],{Name:testcreateskykey2, Type:2, Entropy:[211, 5, 193, 136, 188, 238, 189, 60, 45, 105, 83, 91, 159, 186, 144, 37, 89, 175, 239, 194, 142, 28, 188, 115, 154, 147, 152, 64, 198, 231, 129, 62, 162, 217, 230, 93, 110, 128, 152, 231, 98, 66, 113, 116, 70, 188, 45, 223, 107, 144, 37, 251, 231, 10, 95, 178]},
      [203, 115, 161, 103, 153, 106, 102, 14, 50, 70, 230, 99, 186, 73, 131, 207],{Name:key_to_the_castle, Type:2, Entropy:[151, 246, 88, 112, 156, 108, 114, 68, 242, 17, 27, 211, 34, 141, 69, 84, 112, 85, 154, 5, 181, 9, 88, 180, 110, 254, 47, 72, 249, 214, 161, 218, 10, 20, 123, 169, 113, 68, 172, 92, 57, 2, 112, 134, 11, 38, 56, 43, 36, 224, 59, 192, 234, 54, 176, 45]},
      [241, 43, 126, 22, 19, 232, 202, 130, 173, 160, 12, 196, 176, 189, 91, 112],{Name:testcreateskykey3, Type:2, Entropy:[118, 52, 85, 156, 53, 188, 21, 44, 198, 201, 27, 233, 137, 73, 1, 29, 28, 84, 186, 65, 48, 36, 146, 154, 231, 107, 152, 130, 216, 26, 232, 107, 26, 96, 130, 1, 129, 198, 94, 202, 249, 216, 234, 49, 112, 69, 174, 59, 20, 108, 30, 203, 148, 68, 172, 185]}
    ]);
    this.idsByName = new Map([
      ["",[89, 21, 234, 52, 215, 155, 83, 122, 56, 133, 128, 172, 23, 158, 9, 204]],
      ["key_to_the_castle",[203, 115, 161, 103, 153, 106, 102, 14, 50, 70, 230, 99, 186, 73, 131, 207]],
      ["key_to_the_castle2",[171, 12, 78, 53, 59, 120, 106, 10, 155, 18, 108, 207, 149, 44, 176, 105]],
      ["key_to_the_castles",[46, 227, 121, 225, 164, 23, 114, 121, 167, 176, 123, 168, 158, 128, 22, 209]],
      ["testcreateskykey",[164, 144, 15, 61, 245, 164, 89, 122, 108, 179, 112, 111, 48, 48, 137, 11]],
      ["testcreateskykey2",[190, 194, 169, 203, 161, 171, 75, 219, 89, 251, 87, 233, 7, 221, 14, 120]],
      ["testcreateskykey3",[241, 43, 126, 22, 19, 232, 202, 130, 173, 160, 12, 196, 176, 189, 91, 112]],
      ["testcreateskykey4",[92, 132, 124, 29, 29, 208, 221, 227, 5, 153, 9, 45, 165, 149, 34, 73]]
    ]);
  }

  /**
   * Creates a new Skykey under the given name and SkykeyType.
   */
  createKey(name: string, keyType: skykeyType): Skykey {
    if (name.length > maxKeyNameLen) {
      throw new Error(errSkykeyNameToolong);
    }
    if (!this.supportsSkykeyType(keyType)) {
      throw new Error(errUnsupportedSkykeyType);
    }

    if (this.idsByName.has(name)) {
      throw new Error(errSkykeyWithNameAlreadyExists);
    }

    // Generate the new key.
    const cipherKey = crypto.generateSiaKey(cipherType(keyType));
    const skykey = new Skykey(name, keyType, cipherKey.key());

    this.saveKey(skykey);
    return skykey;
  }

  /**
   * Returns the Skykey associated with that ID.
   */
  keyByID(skykeyID: Uint8Array) {
    if (!this.keysByID.has(skykeyID)) {
      throw new Error(errNoSkykeysWithThatID);
    }

    return this.keysByID.get(skykeyID);
  }

  /**
   * Returns true if and only if the SkykeyManager supports skykeys with the given
   * type.
   */
  supportsSkykeyType(keyType: skykeyType) {
    if (keyType == typePublicID || keyType == typePrivateID) {
      return true;
    }
    return false;
  }

  /**
   * Saves the key and appends it to the skykey file and updates/syncs the header.
   */
  saveKey(skykey: Skykey) {
    const keyID = skykey.ID();

    // Store the new key.
    this.idsByName.set(skykey.name, keyID);
    this.keysByID.set(keyID, skykey);

    // TODO: Store the key in a file.
  }
}
