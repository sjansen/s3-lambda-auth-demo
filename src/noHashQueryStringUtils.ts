import {BasicQueryStringUtils, LocationLike} from '@openid/appauth';

export class NoHashQueryStringUtils extends BasicQueryStringUtils {
    parse(input:LocationLike, useHash:boolean) {
        return super.parse(input, false /* never use hash */);
    }
}
