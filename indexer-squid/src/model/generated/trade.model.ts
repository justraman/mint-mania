import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {TradeSide} from "./_tradeSide"
import {Token} from "./token.model"

@Entity_()
export class Trade {
    constructor(props?: Partial<Trade>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    token!: string

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

    @BigIntColumn_({nullable: false})
    time!: bigint

    @Index_()
    @ManyToOne_(() => Token, {nullable: true})
    tokenEntity!: Token
}
