import {environment} from "../environments/environment";

/**
 * Extending object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 */
export declare class Deferred {
  promise: Promise<any>;
  resolve: any;
  reject: any;

  constructor();
}

export const isMobile = () => (/android|webos|iphone|ipad|ipod|blackberry|windows phone/).test(navigator.userAgent.toLowerCase());

export const baseUrl = () => {
  return location.protocol + "//" + location.host;
};

export const mediaUrlFile = (path) => {
  return environment.FILE_SYSTEM.URL + path;
};
