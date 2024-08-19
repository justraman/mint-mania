import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, BooleanColumn as BooleanColumn_, BigIntColumn as BigIntColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Holders} from "./holders.model"
import {Trades} from "./trades.model"

@Entity_()
export class Tokens {
    constructor(props?: Partial<Tokens>) {
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

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @BooleanColumn_({nullable: false})
    confirmed!: boolean

    @StringColumn_({nullable: true})
    txHash!: string | undefined | null

    @BigIntColumn_({nullable: false})
    marketCap!: bigint

    @OneToMany_(() => Holders, e => e.token)
    holders!: Holders[]

    @OneToMany_(() => Trades, e => e.token)
    trades!: Trades[]
}
