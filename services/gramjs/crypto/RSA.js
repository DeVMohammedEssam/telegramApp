const BigInt = require('big-integer')
const { readBigIntFromBuffer, readBufferFromBigInt, getByteArray, sha1, generateRandomBytes, modExp } = require('../Helpers')

const PUBLIC_KEYS = [{
    'fingerprint': [40, 85, 94, 156, 117, 240, 61, 22, 65, 244, 169, 2, 33, 107, 232, 108, 2, 43, 180, 195],
    'n': BigInt('24403446649145068056824081744112065346446136066297307473868293895086332508101251964919587745984311372853053253457835208829824428441874946556659953519213382748319518214765985662663680818277989736779506318868003755216402538945900388706898101286548187286716959100102939636333452457308619454821845196109544157601096359148241435922125602449263164512290854366930013825808102403072317738266383237191313714482187326643144603633877219028262697593882410403273959074350849923041765639673335775605842311578109726403165298875058941765362622936097839775380070572921007586266115476975819175319995527916042178582540628652481530373407'),
    'e': 65537,
}, {
    'fingerprint': [140, 171, 9, 34, 146, 246, 166, 50, 10, 170, 229, 247, 155, 114, 28, 177, 29, 106, 153, 154],
    'n': BigInt('25081407810410225030931722734886059247598515157516470397242545867550116598436968553551465554653745201634977779380884774534457386795922003815072071558370597290368737862981871277312823942822144802509055492512145589734772907225259038113414940384446493111736999668652848440655603157665903721517224934142301456312994547591626081517162758808439979745328030376796953660042629868902013177751703385501412640560275067171555763725421377065095231095517201241069856888933358280729674273422117201596511978645878544308102076746465468955910659145532699238576978901011112475698963666091510778777356966351191806495199073754705289253783'),
    'e': 65537,
}, {
    'fingerprint': [243, 218, 109, 239, 16, 202, 176, 78, 167, 8, 255, 209, 120, 234, 205, 112, 111, 42, 91, 176],
    'n': BigInt('22347337644621997830323797217583448833849627595286505527328214795712874535417149457567295215523199212899872122674023936713124024124676488204889357563104452250187725437815819680799441376434162907889288526863223004380906766451781702435861040049293189979755757428366240570457372226323943522935844086838355728767565415115131238950994049041950699006558441163206523696546297006014416576123345545601004508537089192869558480948139679182328810531942418921113328804749485349441503927570568778905918696883174575510385552845625481490900659718413892216221539684717773483326240872061786759868040623935592404144262688161923519030977'),
    'e': 65537,
}, {
    'fingerprint': [128, 80, 214, 72, 77, 244, 98, 7, 201, 250, 37, 244, 227, 51, 96, 199, 182, 37, 224, 113],
    'n': BigInt('24573455207957565047870011785254215390918912369814947541785386299516827003508659346069416840622922416779652050319196701077275060353178142796963682024347858398319926119639265555410256455471016400261630917813337515247954638555325280392998950756512879748873422896798579889820248358636937659872379948616822902110696986481638776226860777480684653756042166610633513404129518040549077551227082262066602286208338952016035637334787564972991208252928951876463555456715923743181359826124083963758009484867346318483872552977652588089928761806897223231500970500186019991032176060579816348322451864584743414550721639495547636008351'),
    'e': 65537,
}]

const _serverKeys = {}

PUBLIC_KEYS.forEach(({ fingerprint, ...keyInfo }) => {
    _serverKeys[readBigIntFromBuffer(fingerprint.slice(-8), true, true)] = keyInfo
})

/**
 * Encrypts the given data known the fingerprint to be used
 * in the way Telegram requires us to do so (sha1(data) + data + padding)

 * @param fingerprint the fingerprint of the RSA key.
 * @param data the data to be encrypted.
 * @returns {Buffer|*|undefined} the cipher text, or None if no key matching this fingerprint is found.
 */
async function encrypt(fingerprint, data) {
    const key = _serverKeys[fingerprint]
    if (!key) {
        return undefined
    }

    // len(sha1.digest) is always 20, so we're left with 255 - 20 - x padding
    const rand = generateRandomBytes(235 - data.length)

    const toEncrypt = Buffer.concat([await sha1(data), data, rand])

    // rsa module rsa.encrypt adds 11 bits for padding which we don't want
    // rsa module uses rsa.transform.bytes2int(to_encrypt), easier way:
    const payload = readBigIntFromBuffer(toEncrypt, false)
    const encrypted = modExp(payload, BigInt(key.e), key.n)
    // rsa module uses transform.int2bytes(encrypted, keylength), easier:
    return readBufferFromBigInt(encrypted, 256, false)
}

module.exports = {
    encrypt,
}
