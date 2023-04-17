import type { Merch } from '$lib/merch/merch';
import type {
    MerchFilterOption,
    MerchSortOption,
    MerchViewRepository
} from '$lib/merch/merch.repository';

export class MerchViewServices {
    merchRepository: MerchViewRepository;

    constructor(merchRepository: MerchViewRepository) {
        this.merchRepository = merchRepository;
    }

    async allMerchs(filter?: MerchFilterOption, sort?: MerchSortOption): Promise<Merch[]> {
        return await this.merchRepository.allMerchs(filter, sort);
    }
}
