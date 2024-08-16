import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Tokens} from "./tokens.model"
import {TradeSide} from "./_tradeSide"

@Entity_()
export class Trades {
    constructor(props?: Partial<Trades>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Tokens, {nullable: true})
    token!: Tokens

    @StringColumn_({nullable: false})
    txHash!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @IntColumn_({nullable: false})
    price!: number

    @Column_("varchar", {length: 4, nullable: false})
    side!: TradeSide

    @StringColumn_({nullable: true})
    address!: string | undefined | null

    @DateTimeColumn_({nullable: false})
    time!: Date
}
