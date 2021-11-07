/**
 * Run the XiaomiMapParser on the supplied filename.
 * Example usage: nodejs viomi_manual_map_parser.js /tmp/mapdata
 */
import RRMapParser from "../server/lib/xiaomi/service/RRMapParser";
import {inflateSync} from "zlib";
import {readFileSync} from "fs";

let binary = readFileSync(process.argv[2]);
binary = inflateSync(binary);
let parser = RRMapParser.PARSE(binary);