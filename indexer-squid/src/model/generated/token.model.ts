import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Holder} from "./holder.model"
import {Trade} from "./trade.model"

@Entity_()
export class Token {
    constructor(props?: Partial<Token>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_({unique: true})
    @StringColumn_({nullable: true})
    address!: string | undefined | null

    @StringColumn_({nullable: false})
    name!: string

    @StringColumn_({nullable: false})
    symbol!: string

    @StringColumn_({nullable: true})
    image!: string | undefined | null

    @StringColumn_({nullable: true})
    twitter!: string | undefined | null

    @StringColumn_({nullable: true})
    telegram!: string | undefined | null

    @StringColumn_({nullable: true})
    discord!: string | undefined | null

    @StringColumn_({nullable: true})
    website!: string | undefined | null

    @BigIntColumn_({nullable: false})
    createdAt!: bigint

    @BooleanColumn_({nullable: false})
    confirmed!: boolean

    @StringColumn_({nullable: false})
    txHash!: string

    @BigIntColumn_({nullable: false})
    marketCap!: bigint

    @OneToMany_(() => Holder, e => e.tokenEntity)
    holders!: Holder[]

    @OneToMany_(() => Trade, e => e.tokenEntity)
    trades!: Trade[]
}
