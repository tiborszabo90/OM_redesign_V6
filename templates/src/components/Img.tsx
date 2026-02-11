import React from 'react'
import type { JSX } from 'react/jsx-runtime'

import { useLocation } from 'react-router-dom'

import images_458bd130_843c_409e_834c_d46bc2e0e2c9_svg from '/images/458bd130-843c-409e-834c-d46bc2e0e2c9.svg';
import images_31747a82_a8bb_4582_8fc8_efecedc8b39c_svg from '/images/31747a82-a8bb-4582-8fc8-efecedc8b39c.svg';
import images_2c63751d_2993_4678_889b_880798b5a8ee_svg from '/images/2c63751d-2993-4678-889b-880798b5a8ee.svg';
import images_eae98d2e_1e94_495b_a268_fd139e407f86_svg from '/images/eae98d2e-1e94-495b-a268-fd139e407f86.svg';
import images_559030f0_afbf_448f_8f18_4b92098cc9bd_svg from '/images/559030f0-afbf-448f-8f18-4b92098cc9bd.svg';
import images_330f8db3_0039_437b_98a7_142359f1dff0_svg from '/images/330f8db3-0039-437b-98a7-142359f1dff0.svg';
import images_842142d6_d9c9_4422_a5cc_34a390dd24a0_svg from '/images/842142d6-d9c9-4422-a5cc-34a390dd24a0.svg';
import images_34357eeb_5573_4d58_b892_ef3aa0ce223d_svg from '/images/34357eeb-5573-4d58-b892-ef3aa0ce223d.svg';
import images_3d595cbc_deb5_41fd_9342_12c8cab6bd6e_svg from '/images/3d595cbc-deb5-41fd-9342-12c8cab6bd6e.svg';
import images_4810d0f4_0449_4430_af06_612aa5d0e2d7_svg from '/images/4810d0f4-0449-4430-af06-612aa5d0e2d7.svg';
import images_6a37547f_8219_4fcc_b788_5d9821538037_svg from '/images/6a37547f-8219-4fcc-b788-5d9821538037.svg';
import images_69eba624_f632_4ea2_8e48_468439977192_svg from '/images/69eba624-f632-4ea2-8e48-468439977192.svg';
import images_dd49aed4_222d_4a57_bf23_9098a1e96a98_svg from '/images/dd49aed4-222d-4a57-bf23-9098a1e96a98.svg';
import images_b0511669_88cf_4dff_901a_69c95ca0d428_svg from '/images/b0511669-88cf-4dff-901a-69c95ca0d428.svg';
import images_81996f33_c586_4e80_8087_7c50d95ef1b3_png from '/images/81996f33-c586-4e80-8087-7c50d95ef1b3.png';
import images_5fff889d_4f8d_41ea_a05d_c2c63e637012_png from '/images/5fff889d-4f8d-41ea-a05d-c2c63e637012.png';
import images_56321723_3ed1_4b00_b702_7b724a5513c1_png from '/images/56321723-3ed1-4b00-b702-7b724a5513c1.png';
import images_aa586202_b30c_4897_a3cb_d52cea82a535_png from '/images/aa586202-b30c-4897-a3cb-d52cea82a535.png';
import images_0fd637fe_ef63_4648_af78_0a4b6ca7260a_png from '/images/0fd637fe-ef63-4648-af78-0a4b6ca7260a.png';
import images_34080ec8_65af_4dfc_b7e5_75c804949047_png from '/images/34080ec8-65af-4dfc-b7e5-75c804949047.png';
import images_35c0de4a_fc1f_4d01_99a4_0dd71de47699_png from '/images/35c0de4a-fc1f-4d01-99a4-0dd71de47699.png';
import images_76dcd682_0da9_472e_a6b0_cadc036fd448_png from '/images/76dcd682-0da9-472e-a6b0-cadc036fd448.png';
import images_0f50c403_2fa3_4a30_8074_35344259c155_png from '/images/0f50c403-2fa3-4a30-8074-35344259c155.png';
import images_ec943af0_5323_4252_aa3d_e9f8ad4a9768_png from '/images/ec943af0-5323-4252-aa3d-e9f8ad4a9768.png';
import images_a9104c81_23b5_4f41_a6fd_ac1969d2d955_png from '/images/a9104c81-23b5-4f41-a6fd-ac1969d2d955.png';
import images_1243bd07_03e5_408c_8fd4_b214f3f2410d_png from '/images/1243bd07-03e5-408c-8fd4-b214f3f2410d.png';
import images_8d4f7f63_5801_441e_b9c8_e81c5638a022_png from '/images/8d4f7f63-5801-441e-b9c8-e81c5638a022.png';
import images_e164afbe_1833_407d_ad23_da3e7c597689_png from '/images/e164afbe-1833-407d-ad23-da3e7c597689.png';
import images_f6bffe60_d628_47ab_b735_d16763517679_png from '/images/f6bffe60-d628-47ab-b735-d16763517679.png';
import images_8bd83ae6_9b0f_4acd_a21c_7147b4a4c671_png from '/images/8bd83ae6-9b0f-4acd-a21c-7147b4a4c671.png';
import images_51bca3e3_8561_459f_a5b0_6f62af275f68_png from '/images/51bca3e3-8561-459f-a5b0-6f62af275f68.png';
import images_5fea28fc_925a_44af_9290_ef629900e76b_png from '/images/5fea28fc-925a-44af-9290-ef629900e76b.png';
import images_d825a031_1775_4ded_8753_fb26a8f31b63_png from '/images/d825a031-1775-4ded-8753-fb26a8f31b63.png';
import images_7588675a_8b85_4878_87c3_f9d9b2565308_png from '/images/7588675a-8b85-4878-87c3-f9d9b2565308.png';
import images_d1f3e0eb_8d6c_47d9_91d3_d289fbad7897_png from '/images/d1f3e0eb-8d6c-47d9-91d3-d289fbad7897.png';
import images_94b79957_67a4_4447_a220_5e8bc40bddb7_png from '/images/94b79957-67a4-4447-a220-5e8bc40bddb7.png';
import images_0fb53879_6d95_4123_adcd_926e7e49d508_png from '/images/0fb53879-6d95-4123-adcd-926e7e49d508.png';
import images_49823439_7f0e_468d_b203_84d2a7626676_png from '/images/49823439-7f0e-468d-b203-84d2a7626676.png';
import images_ebc34adb_83c1_4610_8527_640a0d6c3fc3_png from '/images/ebc34adb-83c1-4610-8527-640a0d6c3fc3.png';
import images_40d3b821_ef8a_4092_8dcb_a2439e0fc1bd_png from '/images/40d3b821-ef8a-4092-8dcb-a2439e0fc1bd.png';
import images_25f920e8_c799_4af0_ae65_b2658c34bcfc_png from '/images/25f920e8-c799-4af0-ae65-b2658c34bcfc.png';
import images_bc71558e_6b8e_442e_a1f6_717562e8f301_png from '/images/bc71558e-6b8e-442e-a1f6-717562e8f301.png';
import images_53604674_1321_4e52_82d9_2f53e183e200_png from '/images/53604674-1321-4e52-82d9-2f53e183e200.png';
import images_41f50eff_8fd7_46f0_a3fd_22c3c9ff172c_png from '/images/41f50eff-8fd7-46f0-a3fd-22c3c9ff172c.png';
import images_f60f3c64_216a_49f6_9ede_c1f54ef35176_png from '/images/f60f3c64-216a-49f6-9ede-c1f54ef35176.png';
import images_a553e3da_338b_455b_bdcb_0e149995c7f4_png from '/images/a553e3da-338b-455b-bdcb-0e149995c7f4.png';
import images_00684f28_2bc2_42c4_8c59_7d4ee8d3f6d6_png from '/images/00684f28-2bc2-42c4-8c59-7d4ee8d3f6d6.png';
import images_1f2a648f_9ec9_4be8_87de_ad30c0ef364b_png from '/images/1f2a648f-9ec9-4be8-87de-ad30c0ef364b.png';
import images_3e0abb45_d066_4f4a_acc2_71477baed233_png from '/images/3e0abb45-d066-4f4a-acc2-71477baed233.png';
import images_af15ed89_732b_40ea_bd94_e6f75a9d588e_png from '/images/af15ed89-732b-40ea-bd94-e6f75a9d588e.png';
import images_3081c37e_a317_4a07_85c3_c62c563e2803_png from '/images/3081c37e-a317-4a07-85c3-c62c563e2803.png';
import images_ee855eb0_27c4_4d0c_91a4_312c75cc489d_png from '/images/ee855eb0-27c4-4d0c-91a4-312c75cc489d.png';
import images_5e9332ac_f3a0_444f_8f83_caf9f66404ef_png from '/images/5e9332ac-f3a0-444f-8f83-caf9f66404ef.png';
import images_22718da0_6482_4434_95c1_781310a7245d_png from '/images/22718da0-6482-4434-95c1-781310a7245d.png';
import images_c5b6ec58_4628_4984_b4bb_78c174d5044e_png from '/images/c5b6ec58-4628-4984-b4bb-78c174d5044e.png';
import images_d7b914cd_d441_4d38_95d0_88c3cc0e66b8_png from '/images/d7b914cd-d441-4d38-95d0-88c3cc0e66b8.png';
import images_334ed3a6_70fa_4fb9_abd4_ea54b63eedc5_png from '/images/334ed3a6-70fa-4fb9-abd4-ea54b63eedc5.png';
import images_ceeaf9f2_2ccd_4513_b805_796731c6537d_png from '/images/ceeaf9f2-2ccd-4513-b805-796731c6537d.png';
import images_d268ec06_692e_47e0_ab1e_d118b05e5fb8_png from '/images/d268ec06-692e-47e0-ab1e-d118b05e5fb8.png';
import images_67b36ec5_9d13_49d4_aa4d_ac03a9793ee2_png from '/images/67b36ec5-9d13-49d4-aa4d-ac03a9793ee2.png';
import images_cb598f37_002c_4867_b043_5cb857613a93_png from '/images/cb598f37-002c-4867-b043-5cb857613a93.png';
import images_2126f069_489a_428b_8372_9004bf30f88b_png from '/images/2126f069-489a-428b-8372-9004bf30f88b.png';
import images_029a9960_2cf6_44de_842b_16e5c582e615_png from '/images/029a9960-2cf6-44de-842b-16e5c582e615.png';
import images_caab0448_4a2f_482c_a8ae_693b37e92d6e_png from '/images/caab0448-4a2f-482c-a8ae-693b37e92d6e.png';
import images_71015e0b_e2c2_4b39_8ae5_745b8b2d8eae_png from '/images/71015e0b-e2c2-4b39-8ae5-745b8b2d8eae.png';
import images_43e12ddd_ffe3_45a9_87b7_2c2098de5ecb_png from '/images/43e12ddd-ffe3-45a9-87b7-2c2098de5ecb.png';
import images_451d0811_f090_454b_8c10_59b49141a4be_png from '/images/451d0811-f090-454b-8c10-59b49141a4be.png';
import images_2163ae71_832e_4c45_8d40_7ade1f0dffa9_png from '/images/2163ae71-832e-4c45-8d40-7ade1f0dffa9.png';
import images_e1c7ceda_b87c_47cf_b030_1df2b4aabc2d_png from '/images/e1c7ceda-b87c-47cf-b030-1df2b4aabc2d.png';
import images_3b7469d5_6bbc_4184_97d2_94b3a13521b3_png from '/images/3b7469d5-6bbc-4184-97d2-94b3a13521b3.png';
import images_fe6e2b48_ff28_40b4_aa3e_b2d44f53fdbb_png from '/images/fe6e2b48-ff28-40b4-aa3e-b2d44f53fdbb.png';
import images_59617754_c6d9_443e_b3b9_dc7552ee88b4_png from '/images/59617754-c6d9-443e-b3b9-dc7552ee88b4.png';
import images_2af7e975_e2d9_4d8a_a842_48ff907a688e_png from '/images/2af7e975-e2d9-4d8a-a842-48ff907a688e.png';
import images_82648627_d868_4827_b34e_20ca04d0ca66_png from '/images/82648627-d868-4827-b34e-20ca04d0ca66.png';
import images_0272260f_ab1c_46a6_a161_581bf639e82e_png from '/images/0272260f-ab1c-46a6-a161-581bf639e82e.png';
import images_cb6ea91e_80db_4560_8a57_229b9e75285a_png from '/images/cb6ea91e-80db-4560-8a57-229b9e75285a.png';
import images_99cd238c_39c7_4d38_862c_824eb44227df_png from '/images/99cd238c-39c7-4d38-862c-824eb44227df.png';
import images_f849deec_f38a_414e_9968_09974501a040_png from '/images/f849deec-f38a-414e-9968-09974501a040.png';
import assets_data_asset_8d8166d0_e077_483b_9fbf_61ae5438a2f2_svg from '/assets/data-asset-8d8166d0-e077-483b-9fbf-61ae5438a2f2.svg';
import assets_data_asset_953b5d2b_f5a6_4148_8901_a8a141b63484_svg from '/assets/data-asset-953b5d2b-f5a6-4148-8901-a8a141b63484.svg';
import images_b59124f7_940f_413d_b020_b37433cff547_svg from '/images/b59124f7-940f-413d-b020-b37433cff547.svg';
import assets_data_asset_3b19ee67_ebe7_483a_9972_c78abd8887c0_svg from '/assets/data-asset-3b19ee67-ebe7-483a-9972-c78abd8887c0.svg';
import assets_data_asset_8124a3cc_de91_46ac_aaeb_2cb63336ceff_svg from '/assets/data-asset-8124a3cc-de91-46ac-aaeb-2cb63336ceff.svg';
import assets_data_asset_8c3fe0ed_658a_42e2_ae32_8525e4ccf7b8_svg from '/assets/data-asset-8c3fe0ed-658a-42e2-ae32-8525e4ccf7b8.svg';
import assets_data_asset_fc8d6067_f07e_4b84_810c_bc2338ddca30_svg from '/assets/data-asset-fc8d6067-f07e-4b84-810c-bc2338ddca30.svg';
import assets_data_asset_cbb622a1_e77a_4ddd_9cfd_6410bc2c2998_svg from '/assets/data-asset-cbb622a1-e77a-4ddd-9cfd-6410bc2c2998.svg';
import assets_data_asset_e44a18ec_bb17_4649_9a98_408049f5ba83_svg from '/assets/data-asset-e44a18ec-bb17-4649-9a98-408049f5ba83.svg';
import images_397f7448_f569_4684_93e1_b61996757b10_png from '/images/397f7448-f569-4684-93e1-b61996757b10.png';
import images_642a19c8_e5f4_4661_be91_0f89158364c4_png from '/images/642a19c8-e5f4-4661-be91-0f89158364c4.png';
import images_45fac44a_486d_4a8d_9b95_d6a069eb1883_png from '/images/45fac44a-486d-4a8d-9b95-d6a069eb1883.png';
import assets_data_asset_1ec745fc_0615_405f_9082_68237eebb633_svg from '/assets/data-asset-1ec745fc-0615-405f-9082-68237eebb633.svg';
import assets_data_asset_aa50cbc0_a38c_41d4_99dd_8e742c4da910_svg from '/assets/data-asset-aa50cbc0-a38c-41d4-99dd-8e742c4da910.svg';
import images_c2905a67_a874_4e90_999d_99702c4c2e50_png from '/images/c2905a67-a874-4e90-999d-99702c4c2e50.png';

export const Img = ({ id }) => {
    switch (String(id)) {    case "0":
        return (
            <img src={images_458bd130_843c_409e_834c_d46bc2e0e2c9_svg}></img>
        );
    case "1":
        return (
            <img src={images_31747a82_a8bb_4582_8fc8_efecedc8b39c_svg} className={"side-nav-icon"}></img>
        );
    case "2":
        return (
            <img src={images_2c63751d_2993_4678_889b_880798b5a8ee_svg} className={"side-nav-icon"}></img>
        );
    case "3":
        return (
            <img src={images_eae98d2e_1e94_495b_a268_fd139e407f86_svg} className={"side-nav-icon"}></img>
        );
    case "4":
        return (
            <img src={images_559030f0_afbf_448f_8f18_4b92098cc9bd_svg} className={"side-nav-icon"}></img>
        );
    case "5":
        return (
            <img src={images_330f8db3_0039_437b_98a7_142359f1dff0_svg}></img>
        );
    case "6":
        return (
            <img src={images_842142d6_d9c9_4422_a5cc_34a390dd24a0_svg}></img>
        );
    case "7":
        return (
            <img src={images_34357eeb_5573_4d58_b892_ef3aa0ce223d_svg}></img>
        );
    case "8":
        return (
            <img src={images_3d595cbc_deb5_41fd_9342_12c8cab6bd6e_svg}></img>
        );
    case "9":
        return (
            <img src={images_4810d0f4_0449_4430_af06_612aa5d0e2d7_svg}></img>
        );
    case "10":
        return (
            <img src={images_6a37547f_8219_4fcc_b788_5d9821538037_svg}></img>
        );
    case "11":
        return (
            <img src={images_69eba624_f632_4ea2_8e48_468439977192_svg}></img>
        );
    case "12":
        return (
            <img src={images_dd49aed4_222d_4a57_bf23_9098a1e96a98_svg}></img>
        );
    case "13":
        return (
            <img src={images_b0511669_88cf_4dff_901a_69c95ca0d428_svg}></img>
        );
    case "14":
        return (
            <img data-v-021da501={""} src={images_81996f33_c586_4e80_8087_7c50d95ef1b3_png}></img>
        );
    case "15":
        return (
            <img data-v-021da501={""} src={images_5fff889d_4f8d_41ea_a05d_c2c63e637012_png}></img>
        );
    case "16":
        return (
            <img data-v-021da501={""} src={images_56321723_3ed1_4b00_b702_7b724a5513c1_png}></img>
        );
    case "17":
        return (
            <img data-v-021da501={""} src={images_aa586202_b30c_4897_a3cb_d52cea82a535_png}></img>
        );
    case "18":
        return (
            <img data-v-021da501={""} src={images_0fd637fe_ef63_4648_af78_0a4b6ca7260a_png}></img>
        );
    case "19":
        return (
            <img data-v-021da501={""} src={images_34080ec8_65af_4dfc_b7e5_75c804949047_png}></img>
        );
    case "20":
        return (
            <img data-v-021da501={""} src={images_35c0de4a_fc1f_4d01_99a4_0dd71de47699_png}></img>
        );
    case "21":
        return (
            <img data-v-021da501={""} src={images_76dcd682_0da9_472e_a6b0_cadc036fd448_png}></img>
        );
    case "22":
        return (
            <img data-v-021da501={""} src={images_0f50c403_2fa3_4a30_8074_35344259c155_png}></img>
        );
    case "23":
        return (
            <img data-v-021da501={""} src={images_ec943af0_5323_4252_aa3d_e9f8ad4a9768_png}></img>
        );
    case "24":
        return (
            <img data-v-021da501={""} src={images_a9104c81_23b5_4f41_a6fd_ac1969d2d955_png}></img>
        );
    case "25":
        return (
            <img data-v-021da501={""} src={images_1243bd07_03e5_408c_8fd4_b214f3f2410d_png}></img>
        );
    case "26":
        return (
            <img data-v-a7d2a7f0={""} src={images_8d4f7f63_5801_441e_b9c8_e81c5638a022_png}></img>
        );
    case "27":
        return (
            <img data-v-a7d2a7f0={""} src={images_e164afbe_1833_407d_ad23_da3e7c597689_png}></img>
        );
    case "28":
        return (
            <img data-v-a7d2a7f0={""} src={images_f6bffe60_d628_47ab_b735_d16763517679_png}></img>
        );
    case "29":
        return (
            <img data-v-a7d2a7f0={""} src={images_8bd83ae6_9b0f_4acd_a21c_7147b4a4c671_png}></img>
        );
    case "30":
        return (
            <img data-v-a7d2a7f0={""} src={images_51bca3e3_8561_459f_a5b0_6f62af275f68_png}></img>
        );
    case "31":
        return (
            <img data-v-a7d2a7f0={""} src={images_5fea28fc_925a_44af_9290_ef629900e76b_png}></img>
        );
    case "32":
        return (
            <img data-v-a7d2a7f0={""} src={images_d825a031_1775_4ded_8753_fb26a8f31b63_png}></img>
        );
    case "33":
        return (
            <img data-v-a7d2a7f0={""} src={images_7588675a_8b85_4878_87c3_f9d9b2565308_png}></img>
        );
    case "34":
        return (
            <img data-v-a7d2a7f0={""} src={images_d1f3e0eb_8d6c_47d9_91d3_d289fbad7897_png}></img>
        );
    case "35":
        return (
            <img data-v-a7d2a7f0={""} src={images_94b79957_67a4_4447_a220_5e8bc40bddb7_png}></img>
        );
    case "36":
        return (
            <img data-v-a7d2a7f0={""} src={images_0fb53879_6d95_4123_adcd_926e7e49d508_png}></img>
        );
    case "37":
        return (
            <img data-v-a7d2a7f0={""} src={images_49823439_7f0e_468d_b203_84d2a7626676_png}></img>
        );
    case "38":
        return (
            <img data-v-a7d2a7f0={""} src={images_ebc34adb_83c1_4610_8527_640a0d6c3fc3_png}></img>
        );
    case "39":
        return (
            <img data-v-a7d2a7f0={""} src={images_40d3b821_ef8a_4092_8dcb_a2439e0fc1bd_png}></img>
        );
    case "40":
        return (
            <img data-v-a7d2a7f0={""} src={images_25f920e8_c799_4af0_ae65_b2658c34bcfc_png}></img>
        );
    case "41":
        return (
            <img data-v-a7d2a7f0={""} src={images_bc71558e_6b8e_442e_a1f6_717562e8f301_png}></img>
        );
    case "42":
        return (
            <img data-v-a7d2a7f0={""} src={images_53604674_1321_4e52_82d9_2f53e183e200_png}></img>
        );
    case "43":
        return (
            <img src={images_41f50eff_8fd7_46f0_a3fd_22c3c9ff172c_png} className={"use-case-card-image"}></img>
        );
    case "44":
        return (
            <img src={images_f60f3c64_216a_49f6_9ede_c1f54ef35176_png} className={"use-case-card-image"}></img>
        );
    case "45":
        return (
            <img src={images_a553e3da_338b_455b_bdcb_0e149995c7f4_png} className={"use-case-card-image"}></img>
        );
    case "46":
        return (
            <img data-v-021da501={""} src={images_25f920e8_c799_4af0_ae65_b2658c34bcfc_png}></img>
        );
    case "47":
        return (
            <img data-v-021da501={""} src={images_bc71558e_6b8e_442e_a1f6_717562e8f301_png}></img>
        );
    case "48":
        return (
            <img data-v-021da501={""} src={images_40d3b821_ef8a_4092_8dcb_a2439e0fc1bd_png}></img>
        );
    case "49":
        return (
            <img src={images_00684f28_2bc2_42c4_8c59_7d4ee8d3f6d6_png} className={"use-case-card-image"}></img>
        );
    case "50":
        return (
            <img src={images_1f2a648f_9ec9_4be8_87de_ad30c0ef364b_png} className={"use-case-card-image"}></img>
        );
    case "51":
        return (
            <img src={images_3e0abb45_d066_4f4a_acc2_71477baed233_png} className={"use-case-card-image"}></img>
        );
    case "52":
        return (
            <img src={images_af15ed89_732b_40ea_bd94_e6f75a9d588e_png} className={"use-case-card-image"}></img>
        );
    case "53":
        return (
            <img src={images_3081c37e_a317_4a07_85c3_c62c563e2803_png} className={"use-case-card-image"}></img>
        );
    case "54":
        return (
            <img src={images_ee855eb0_27c4_4d0c_91a4_312c75cc489d_png} className={"use-case-card-image"}></img>
        );
    case "55":
        return (
            <img src={images_5e9332ac_f3a0_444f_8f83_caf9f66404ef_png} className={"use-case-card-image"}></img>
        );
    case "56":
        return (
            <img src={images_22718da0_6482_4434_95c1_781310a7245d_png} className={"use-case-card-image"}></img>
        );
    case "57":
        return (
            <img src={images_c5b6ec58_4628_4984_b4bb_78c174d5044e_png} className={"use-case-card-image"}></img>
        );
    case "58":
        return (
            <img src={images_d7b914cd_d441_4d38_95d0_88c3cc0e66b8_png} className={"use-case-card-image"}></img>
        );
    case "59":
        return (
            <img src={images_334ed3a6_70fa_4fb9_abd4_ea54b63eedc5_png} className={"use-case-card-image"}></img>
        );
    case "60":
        return (
            <img src={images_ceeaf9f2_2ccd_4513_b805_796731c6537d_png} className={"use-case-card-image"}></img>
        );
    case "61":
        return (
            <img src={images_d268ec06_692e_47e0_ab1e_d118b05e5fb8_png} className={"use-case-card-image"}></img>
        );
    case "62":
        return (
            <img src={images_67b36ec5_9d13_49d4_aa4d_ac03a9793ee2_png} className={"use-case-card-image"}></img>
        );
    case "63":
        return (
            <img src={images_cb598f37_002c_4867_b043_5cb857613a93_png} className={"use-case-card-image"}></img>
        );
    case "64":
        return (
            <img src={images_2126f069_489a_428b_8372_9004bf30f88b_png} className={"use-case-card-image"}></img>
        );
    case "65":
        return (
            <img src={images_029a9960_2cf6_44de_842b_16e5c582e615_png} className={"use-case-card-image"}></img>
        );
    case "66":
        return (
            <img src={images_caab0448_4a2f_482c_a8ae_693b37e92d6e_png} className={"use-case-card-image"}></img>
        );
    case "67":
        return (
            <img src={images_71015e0b_e2c2_4b39_8ae5_745b8b2d8eae_png} className={"use-case-card-image"}></img>
        );
    case "68":
        return (
            <img src={images_43e12ddd_ffe3_45a9_87b7_2c2098de5ecb_png} className={"use-case-card-image"}></img>
        );
    case "69":
        return (
            <img src={images_451d0811_f090_454b_8c10_59b49141a4be_png} className={"use-case-card-image"}></img>
        );
    case "70":
        return (
            <img src={images_2163ae71_832e_4c45_8d40_7ade1f0dffa9_png} className={"use-case-card-image"}></img>
        );
    case "71":
        return (
            <img src={images_e1c7ceda_b87c_47cf_b030_1df2b4aabc2d_png} className={"use-case-card-image"}></img>
        );
    case "72":
        return (
            <img src={images_3b7469d5_6bbc_4184_97d2_94b3a13521b3_png} className={"use-case-card-image"}></img>
        );
    case "73":
        return (
            <img src={images_fe6e2b48_ff28_40b4_aa3e_b2d44f53fdbb_png} className={"use-case-card-image"}></img>
        );
    case "74":
        return (
            <img src={images_59617754_c6d9_443e_b3b9_dc7552ee88b4_png} className={"use-case-card-image"}></img>
        );
    case "75":
        return (
            <img src={images_2af7e975_e2d9_4d8a_a842_48ff907a688e_png} className={"use-case-card-image"}></img>
        );
    case "76":
        return (
            <img src={images_82648627_d868_4827_b34e_20ca04d0ca66_png} className={"use-case-card-image"}></img>
        );
    case "77":
        return (
            <img src={images_0272260f_ab1c_46a6_a161_581bf639e82e_png} className={"use-case-card-image"}></img>
        );
    case "78":
        return (
            <img src={images_cb6ea91e_80db_4560_8a57_229b9e75285a_png} className={"use-case-card-image"}></img>
        );
    case "79":
        return (
            <img src={images_99cd238c_39c7_4d38_862c_824eb44227df_png} className={"use-case-card-image"}></img>
        );
    case "80":
        return (
            <img src={images_f849deec_f38a_414e_9968_09974501a040_png} className={"use-case-card-image"}></img>
        );
    case "81":
        return (
            <img className={"om-image"} id={"ele_FEYMmvr1s"} src={assets_data_asset_8d8166d0_e077_483b_9fbf_61ae5438a2f2_svg} alt={"essential_logo_1713259698584.svg"} sizes={""}></img>
        );
    case "82":
        return (
            <img className={"om-image"} id={"ele_fDEDShMOO"} src={assets_data_asset_953b5d2b_f5a6_4148_8901_a8a141b63484_svg} alt={"essential_logo_1713260496364.svg"} sizes={""}></img>
        );
    case "83":
        return (
            <img className={"om-image"} src={images_b59124f7_940f_413d_b020_b37433cff547_svg}></img>
        );
    case "84":
        return (
            <img className={"om-image"} id={"ele_fDEDShMOO"} src={assets_data_asset_3b19ee67_ebe7_483a_9972_c78abd8887c0_svg} alt={"essential_logo_1713259422531.svg"} sizes={""}></img>
        );
    case "85":
        return (
            <img className={"om-image"} id={"ele_0felbKWLJ"} src={assets_data_asset_8124a3cc_de91_46ac_aaeb_2cb63336ceff_svg} alt={"essential_logo_1713260409887.svg"} sizes={""}></img>
        );
    case "86":
        return (
            <img className={"om-image"} id={"ele_2fdlyw6VP"} src={assets_data_asset_8c3fe0ed_658a_42e2_ae32_8525e4ccf7b8_svg} alt={"essential_logo_1713259998034.svg"} sizes={""}></img>
        );
    case "87":
        return (
            <img className={"om-image"} id={"ele_0felbKWLJ"} src={assets_data_asset_fc8d6067_f07e_4b84_810c_bc2338ddca30_svg} alt={"essential_logo_1713259320287.svg"} sizes={""}></img>
        );
    case "88":
        return (
            <img className={"om-image"} id={"ele_wEiDrkx8c"} src={assets_data_asset_cbb622a1_e77a_4ddd_9cfd_6410bc2c2998_svg} alt={"essential_logo_1713260292254.svg"} sizes={""}></img>
        );
    case "89":
        return (
            <img className={"om-image"} id={"ele_OJfNVTYoS"} src={assets_data_asset_e44a18ec_bb17_4649_9a98_408049f5ba83_svg} alt={"essential_logo_1713259917356.svg"} sizes={""}></img>
        );
    case "90":
        return (
            <img className={"om-image"} src={images_397f7448_f569_4684_93e1_b61996757b10_png}></img>
        );
    case "91":
        return (
            <img className={"om-image"} src={images_642a19c8_e5f4_4661_be91_0f89158364c4_png}></img>
        );
    case "92":
        return (
            <img className={"om-image"} src={images_45fac44a_486d_4a8d_9b95_d6a069eb1883_png}></img>
        );
    case "93":
        return (
            <img className={"om-image"} id={"ele_0felbKWLJ"} src={assets_data_asset_1ec745fc_0615_405f_9082_68237eebb633_svg} alt={"essential_logo_1713260701183.svg"} sizes={""}></img>
        );
    case "94":
        return (
            <img className={"om-image"} id={"ele_xtxApHOsl"} src={assets_data_asset_aa50cbc0_a38c_41d4_99dd_8e742c4da910_svg} alt={"essential_logo_1713259812119.svg"} sizes={""}></img>
        );
    case "95":
        return (
            <img src={images_c2905a67_a874_4e90_999d_99702c4c2e50_png} alt={""} className={"intercom-lightweight-app-launcher-custom-icon-open"}></img>
        );
    default:
        return null;
    }
};

export default Img
