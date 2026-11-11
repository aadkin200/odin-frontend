import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CashflowApi } from "./cashflow-api.service";
import { AuthService } from "../core/auth.service";

type Row = Record<string, any> & {
  id: any;
  name: any;
  chapter: any;
  direction: any;
  count: any;
  total: any;
  gang: any;
  relationship: any;
  occurred_at: any;
  handler: any;
  method: any;
  product_category: any;
  currency_kind: any;
  expected_amount: any;
  actual_amount: any;
  gang_kind: any;
  price_week: any;
  product_name: any;
  chapter_id: any;
  purchase_unit_price: any;
  sale_unit_price: any;
  family: any;
  dirty_amount_submitted: any;
  negotiated_fee_percent: any;
  fee_amount: any;
  clean_amount_received: any;
  source_type: any;
  account: any;
  entry_side: any;
  amount: any;
  actor: any;
  entity_type: any;
  action: any;
  reason: any;
  category: any;
};

type Overview = {
  CASH_CLEAN?: number;
  CASH_DIRTY?: number;
  PURCHASE_COST?: number;
  CLEANING_FEES?: number;
  sales?: number;
  purchases?: number;
  unpaidGive?: number;
  byChapter?: Row[];
  byGang?: Row[];
  byMonth?: Row[];
};

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="content cashflow">
      <p class="eyebrow ember">HIGH COMMAND · CLUB TREASURY</p>
      <h1>Cashflow</h1>
      <p>Historical financial records · {{ auth.user()?.displayName }}</p>

      <div class="cash-tabs" role="tablist">
        <button
          *ngFor="let tab of tabs"
          [class.selected]="active() === tab"
          (click)="active.set(tab)"
          type="button"
        >
          {{ tab }}
        </button>
      </div>

      <p class="cash-error" *ngIf="error()" role="alert">
        {{ error() }}
      </p>

      <p class="cash-success" *ngIf="message()">
        {{ message() }}
      </p>

      <!-- DASHBOARD -->

      <div *ngIf="active() === 'Dashboard'">
        <div class="metrics">
          <article>
            <small>Clean cash</small>
            <strong>
              {{ overview()?.CASH_CLEAN ?? 0 | number: "1.2-2" }}
            </strong>
          </article>

          <article>
            <small>Dirty cash</small>
            <strong>
              {{ overview()?.CASH_DIRTY ?? 0 | number: "1.2-2" }}
            </strong>
          </article>

          <article>
            <small>Sales receipts</small>
            <strong>
              {{ overview()?.sales ?? 0 | number: "1.2-2" }}
            </strong>
          </article>

          <article>
            <small>Purchases paid</small>
            <strong>
              {{ overview()?.purchases ?? 0 | number: "1.2-2" }}
            </strong>
          </article>
        </div>

        <div class="cash-grid">
          <article class="panel">
            <h2>Chapter activity</h2>

            <table>
              <thead>
                <tr>
                  <th>Chapter</th>
                  <th>Direction</th>
                  <th>Count</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                <tr *ngFor="let r of overview()?.byChapter">
                  <td>{{ r.chapter }}</td>
                  <td>{{ r.direction }}</td>
                  <td>{{ r.count }}</td>
                  <td>{{ r.total | number: "1.2-2" }}</td>
                </tr>
              </tbody>
            </table>
          </article>

          <article class="panel">
            <h2>Gang activity</h2>

            <table>
              <thead>
                <tr>
                  <th>Gang</th>
                  <th>Direction</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                <tr *ngFor="let r of overview()?.byGang">
                  <td>{{ r.gang }}</td>
                  <td>{{ r.direction }}</td>
                  <td>{{ r.total | number: "1.2-2" }}</td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>

        <div class="panel">
          <h2>Financial summary</h2>

          <p>
            Cleaning fees:
            {{ overview()?.CLEANING_FEES ?? 0 | number: "1.2-2" }}
            · Unpaid allied GIVE value:
            {{ overview()?.unpaidGive ?? 0 | number: "1.2-2" }}
          </p>

          <p>
            These figures reflect recorded outcomes, not inventory profit. Money
            cleaning is a conversion, not sales revenue.
          </p>
        </div>
      </div>

      <!-- TRANSACTIONS -->

      <div *ngIf="active() === 'Transactions'">
        <div class="panel">
          <h2>Record completed transaction</h2>

          <p>
            Enter one category per transaction. Expected value is quantity ×
            unit price; actual value is what the club received or paid.
          </p>

          <form (ngSubmit)="saveTrade()" class="cash-form">
            <label>
              Date/time
              <input
                type="datetime-local"
                name="occurred"
                [(ngModel)]="trade.occurredAt"
                required
              />
            </label>

            <label>
              Chapter
              <select name="chapter" [(ngModel)]="trade.chapterId" required>
                <option *ngFor="let c of chapters()" [ngValue]="c.id">
                  {{ c.name }}
                </option>
              </select>
            </label>

            <label>
              Gang
              <select name="gang" [(ngModel)]="trade.gangId" required>
                <option *ngFor="let g of gangs()" [ngValue]="g.id">
                  {{ g.name }}
                  ({{ g.relationship || "unset" }})
                </option>
              </select>
            </label>

            <label>
              Handler
              <select name="handler" [(ngModel)]="trade.handlerUserId" required>
                <option *ngFor="let u of members()" [ngValue]="u.id">
                  {{ u.name }}
                </option>
              </select>
            </label>

            <label>
              Direction
              <select name="direction" [(ngModel)]="trade.direction">
                <option>SALE</option>
                <option>PURCHASE</option>
              </select>
            </label>

            <label>
              Method
              <select name="method" [(ngModel)]="trade.method">
                <option>OFFER</option>
                <option>GIVE</option>
              </select>
            </label>

            <label>
              Category
              <select
                name="category"
                [(ngModel)]="trade.category"
                (ngModelChange)="syncProduct()"
              >
                <option>DRUG</option>
                <option>WEAPON</option>
              </select>
            </label>

            <label>
              Currency
              <select name="currency" [(ngModel)]="trade.currency">
                <option>DIRTY</option>
                <option>CLEAN</option>
              </select>
            </label>

            <label>
              Product
              <select name="product" [(ngModel)]="trade.productId">
                <option *ngFor="let x of filteredProducts()" [ngValue]="x.id">
                  {{ x.name }}
                </option>
              </select>
            </label>

            <label>
              Quantity
              <input
                type="number"
                min="1"
                name="quantity"
                [(ngModel)]="trade.quantity"
                required
              />
            </label>

            <label>
              Agreed unit price
              <input
                type="number"
                min="0"
                step="0.01"
                name="unitPrice"
                [(ngModel)]="trade.unitPrice"
                required
              />
            </label>

            <label>
              Expected amount
              <input
                [value]="trade.quantity * trade.unitPrice | number: '1.2-2'"
                readonly
              />
            </label>

            <label>
              Actual amount
              <input
                type="number"
                min="0"
                step="0.01"
                name="actualAmount"
                [(ngModel)]="trade.actualAmount"
                required
              />
            </label>

            <label class="cash-wide">
              Notes
              <textarea name="notes" [(ngModel)]="trade.notes"></textarea>
            </label>

            <button class="cash-primary" type="submit" [disabled]="saving()">
              Record transaction
            </button>
          </form>
        </div>

        <div class="panel">
          <h2>Transaction history</h2>

          <div class="cash-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Chapter</th>
                  <th>Gang</th>
                  <th>Handler</th>
                  <th>Direction</th>
                  <th>Method</th>
                  <th>Category</th>
                  <th>Currency</th>
                  <th>Expected</th>
                  <th>Actual</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                <tr *ngFor="let t of trades()">
                  <td>{{ t.occurred_at | date: "short" }}</td>
                  <td>{{ t.chapter }}</td>
                  <td>{{ t.gang }}</td>
                  <td>{{ t.handler }}</td>
                  <td>{{ t.direction }}</td>
                  <td>{{ t.method }}</td>
                  <td>{{ t.product_category }}</td>
                  <td>{{ t.currency_kind }}</td>
                  <td>
                    {{ t.expected_amount | number: "1.2-2" }}
                  </td>
                  <td>
                    {{ t.actual_amount | number: "1.2-2" }}
                  </td>
                  <td>
                    <button type="button" (click)="voidRecord('trades', t.id)">
                      Void
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- GANGS -->

      <div *ngIf="active() === 'Gangs'">
        <div class="panel">
          <h2>Add gang / crime family</h2>

          <form class="cash-form" (ngSubmit)="saveGang()">
            <label>
              Name
              <input name="gangName" [(ngModel)]="gang.name" required />
            </label>

            <label>
              Kind
              <select name="gangKind" [(ngModel)]="gang.kind">
                <option>GANG</option>
                <option>CRIME_FAMILY</option>
              </select>
            </label>

            <label>
              Relationship
              <select name="gangRel" [(ngModel)]="gang.relationship">
                <option>ALLY</option>
                <option>NON_ALLY</option>
                <option>NEUTRAL</option>
              </select>
            </label>

            <button class="cash-primary" type="submit">Add gang</button>
          </form>
        </div>

        <div class="panel">
          <h2>Gang relationships</h2>

          <p>
            Relationship changes preserve history. Transactions snapshot the
            relationship at their event date.
          </p>

          <div *ngFor="let g of gangs()" class="cash-line">
            <strong>{{ g.name }}</strong>

            <span> {{ g.gang_kind }} · {{ g.relationship }} </span>

            <select #rel>
              <option>ALLY</option>
              <option>NON_ALLY</option>
              <option>NEUTRAL</option>
            </select>

            <button type="button" (click)="changeRelationship(g, rel.value)">
              Update
            </button>
          </div>
        </div>
      </div>

      <!-- PRICES -->

      <div *ngIf="active() === 'Prices'">
        <div class="panel">
          <h2>Weekly market values</h2>

          <form class="cash-form" (ngSubmit)="savePrice()">
            <label>
              Product
              <select name="priceProduct" [(ngModel)]="price.productId">
                <option *ngFor="let p of products()" [ngValue]="p.id">
                  {{ p.name }}
                </option>
              </select>
            </label>

            <label>
              Chapter (optional)
              <select name="priceChapter" [(ngModel)]="price.chapterId">
                <option [ngValue]="null">Club-wide</option>

                <option *ngFor="let c of chapters()" [ngValue]="c.id">
                  {{ c.name }}
                </option>
              </select>
            </label>

            <label>
              Week starting Monday
              <input
                type="date"
                name="week"
                [(ngModel)]="price.priceWeek"
                required
              />
            </label>

            <label>
              Purchase price
              <input
                type="number"
                name="buy"
                min="0"
                step="0.01"
                [(ngModel)]="price.purchaseUnitPrice"
              />
            </label>

            <label>
              Sale price
              <input
                type="number"
                name="sell"
                min="0"
                step="0.01"
                [(ngModel)]="price.saleUnitPrice"
              />
            </label>

            <button class="cash-primary" type="submit">Save price</button>
          </form>
        </div>

        <div class="panel">
          <h2>Price history</h2>

          <div class="cash-scroll">
            <table>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Product</th>
                  <th>Chapter ID</th>
                  <th>Buy</th>
                  <th>Sell</th>
                </tr>
              </thead>

              <tbody>
                <tr *ngFor="let p of prices()">
                  <td>{{ p.price_week }}</td>
                  <td>{{ p.product_name }}</td>
                  <td>{{ p.chapter_id || "All" }}</td>
                  <td>{{ p.purchase_unit_price }}</td>
                  <td>{{ p.sale_unit_price }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- CLEANING -->

      <div *ngIf="active() === 'Cleaning'">
        <div class="panel">
          <h2>Record money cleaning</h2>

          <form class="cash-form" (ngSubmit)="saveCleaning()">
            <label>
              Date/time
              <input
                type="datetime-local"
                name="cleanWhen"
                [(ngModel)]="clean.occurredAt"
                required
              />
            </label>

            <label>
              Chapter
              <select name="cleanChapter" [(ngModel)]="clean.chapterId">
                <option *ngFor="let c of chapters()" [ngValue]="c.id">
                  {{ c.name }}
                </option>
              </select>
            </label>

            <label>
              Crime family
              <select name="cleanGang" [(ngModel)]="clean.gangId">
                <option *ngFor="let g of crimeFamilies()" [ngValue]="g.id">
                  {{ g.name }}
                </option>
              </select>
            </label>

            <label>
              Handler
              <select name="cleanHandler" [(ngModel)]="clean.handlerUserId">
                <option *ngFor="let u of members()" [ngValue]="u.id">
                  {{ u.name }}
                </option>
              </select>
            </label>

            <label>
              Dirty amount
              <input
                type="number"
                name="dirty"
                min="0.01"
                step="0.01"
                [(ngModel)]="clean.dirtyAmount"
              />
            </label>

            <label>
              Negotiated fee %
              <input
                type="number"
                name="fee"
                min="0"
                max="100"
                step="0.0001"
                [(ngModel)]="clean.feePercent"
              />
            </label>

            <label class="cash-wide">
              Notes
              <textarea name="cleanNotes" [(ngModel)]="clean.notes"></textarea>
            </label>

            <p class="cash-wide">
              Fee:
              {{
                (clean.dirtyAmount * clean.feePercent) / 100 | number: "1.2-2"
              }}
              · Clean received:
              {{
                clean.dirtyAmount * (1 - clean.feePercent / 100)
                  | number: "1.2-2"
              }}
            </p>

            <button class="cash-primary" type="submit">Record cleaning</button>
          </form>
        </div>

        <div class="panel">
          <h2>Cleaning history</h2>

          <div class="cash-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Chapter</th>
                  <th>Family</th>
                  <th>Dirty</th>
                  <th>Fee %</th>
                  <th>Fee</th>
                  <th>Clean</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                <tr *ngFor="let c of cleanings()">
                  <td>{{ c.occurred_at | date: "short" }}</td>
                  <td>{{ c.chapter }}</td>
                  <td>{{ c.family }}</td>
                  <td>{{ c.dirty_amount_submitted }}</td>
                  <td>{{ c.negotiated_fee_percent }}</td>
                  <td>{{ c.fee_amount }}</td>
                  <td>{{ c.clean_amount_received }}</td>
                  <td>
                    <button
                      type="button"
                      (click)="voidRecord('cleanings', c.id)"
                    >
                      Void
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TREASURY -->

      <div *ngIf="active() === 'Treasury'">
        <div class="panel">
          <h2>Manual treasury adjustment</h2>

          <p>
            Use for opening balances or documented corrections. Every adjustment
            creates a balanced ledger journal and audit entry.
          </p>

          <form class="cash-form" (ngSubmit)="saveAdjustment()">
            <label>
              Money type
              <select name="adjCurrency" [(ngModel)]="adjustment.currency">
                <option>CLEAN</option>
                <option>DIRTY</option>
              </select>
            </label>

            <label>
              Direction
              <select name="adjDirection" [(ngModel)]="adjustment.direction">
                <option>IN</option>
                <option>OUT</option>
              </select>
            </label>

            <label>
              Amount
              <input
                type="number"
                min="0.01"
                step="0.01"
                name="adjAmount"
                [(ngModel)]="adjustment.amount"
              />
            </label>

            <label class="cash-wide">
              Reason (required)
              <textarea
                name="adjReason"
                [(ngModel)]="adjustment.reason"
              ></textarea>
            </label>

            <button class="cash-primary" type="submit">Post adjustment</button>
          </form>
        </div>

        <div class="panel">
          <h2>Ledger entries</h2>

          <div class="cash-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Account</th>
                  <th>Side</th>
                  <th>Amount</th>
                  <th>Chapter</th>
                </tr>
              </thead>

              <tbody>
                <tr *ngFor="let e of ledger()">
                  <td>{{ e.occurred_at | date: "short" }}</td>
                  <td>{{ e.source_type }}</td>
                  <td>{{ e.account }}</td>
                  <td>{{ e.entry_side }}</td>
                  <td>{{ e.amount }}</td>
                  <td>{{ e.chapter }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- REPORTS -->

      <div *ngIf="active() === 'Reports'">
        <div class="panel">
          <h2>Exports</h2>

          <p>
            Download the currently loaded transaction, cleaning, and audit
            records as CSV, suitable for Excel. These exports do not constitute
            a PDF report.
          </p>

          <button type="button" (click)="exportCsv('transactions', trades())">
            Export transactions CSV
          </button>

          <button type="button" (click)="exportCsv('cleanings', cleanings())">
            Export cleaning CSV
          </button>

          <button type="button" (click)="exportCsv('audit', audit())">
            Export audit CSV
          </button>
        </div>

        <div class="panel">
          <h2>Audit trail</h2>

          <div class="cash-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Actor</th>
                  <th>Entity</th>
                  <th>Action</th>
                  <th>Reason</th>
                </tr>
              </thead>

              <tbody>
                <tr *ngFor="let a of audit()">
                  <td>{{ a.occurred_at | date: "short" }}</td>
                  <td>{{ a.actor }}</td>
                  <td>{{ a.entity_type }}</td>
                  <td>{{ a.action }}</td>
                  <td>{{ a.reason }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CashflowComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(CashflowApi);

  tabs = [
    "Dashboard",
    "Transactions",
    "Gangs",
    "Prices",
    "Cleaning",
    "Treasury",
    "Reports",
  ];

  active = signal("Dashboard");
  error = signal("");
  message = signal("");
  saving = signal(false);

  overview = signal<Overview | null>(null);

  chapters = signal<Row[]>([]);
  products = signal<Row[]>([]);
  members = signal<Row[]>([]);
  gangs = signal<Row[]>([]);
  prices = signal<Row[]>([]);
  trades = signal<Row[]>([]);
  cleanings = signal<Row[]>([]);
  ledger = signal<Row[]>([]);
  audit = signal<Row[]>([]);

  trade = {
    occurredAt: this.now(),
    chapterId: 0,
    gangId: 0,
    handlerUserId: 0,
    direction: "SALE",
    method: "OFFER",
    currency: "DIRTY",
    category: "DRUG",
    productId: 0,
    quantity: 1,
    unitPrice: 0,
    actualAmount: 0,
    notes: "",
  };

  gang = {
    name: "",
    kind: "GANG",
    relationship: "NON_ALLY",
  };

  price = {
    productId: 0,
    chapterId: null as number | null,
    priceWeek: this.monday(),
    purchaseUnitPrice: 0,
    saleUnitPrice: 0,
  };

  clean = {
    occurredAt: this.now(),
    chapterId: 0,
    gangId: 0,
    handlerUserId: 0,
    dirtyAmount: 0,
    feePercent: 0,
    notes: "",
  };

  adjustment = {
    currency: "CLEAN",
    direction: "IN",
    amount: 0,
    reason: "",
  };

  now(): string {
    const d = new Date();

    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  }

  monday(): string {
    const d = new Date();

    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));

    return d.toISOString().slice(0, 10);
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    const paths: [string, (x: any) => void][] = [
      ["overview", (v) => this.overview.set(v)],
      [
        "reference/chapters",
        (v) => {
          this.chapters.set(v);

          if (!this.trade.chapterId) {
            this.trade.chapterId = v[0]?.id;
          }

          if (!this.clean.chapterId) {
            this.clean.chapterId = v[0]?.id;
          }
        },
      ],
      [
        "reference/products",
        (v) => {
          this.products.set(v);

          if (!this.price.productId) {
            this.price.productId = v[0]?.id;
          }

          this.syncProduct();
        },
      ],
      [
        "members",
        (v) => {
          this.members.set(v);

          if (!this.trade.handlerUserId) {
            this.trade.handlerUserId = v[0]?.id;
          }

          if (!this.clean.handlerUserId) {
            this.clean.handlerUserId = v[0]?.id;
          }
        },
      ],
      ["gangs", (v) => this.gangs.set(v)],
      ["prices", (v) => this.prices.set(v)],
      ["trades", (v) => this.trades.set(v)],
      ["cleanings", (v) => this.cleanings.set(v)],
      ["ledger", (v) => this.ledger.set(v)],
      ["audit", (v) => this.audit.set(v)],
    ];

    for (const [path, set] of paths) {
      this.api.get<any>(path).subscribe({
        next: set,
        error: () => {
          this.error.set(
            "Unable to load " +
              path +
              ". Confirm Spring Boot and Discord authorization are configured.",
          );
        },
      });
    }
  }

  filteredProducts(): Row[] {
    return this.products().filter((p) => p.category === this.trade.category);
  }

  crimeFamilies(): Row[] {
    return this.gangs().filter((g) => g.gang_kind === "CRIME_FAMILY");
  }

  syncProduct(): void {
    if (!this.filteredProducts().some((p) => p.id === this.trade.productId)) {
      this.trade.productId = this.filteredProducts()[0]?.id || 0;
    }
  }

  submit(path: string, body: unknown): void {
    this.error.set("");
    this.message.set("");
    this.saving.set(true);

    this.api.post(path, body).subscribe({
      next: () => {
        this.message.set("Saved successfully.");
        this.saving.set(false);
        this.refresh();
      },
      error: (e) => {
        this.error.set(
          e.error?.message ||
            e.error?.detail ||
            "Unable to save. Check required fields and permissions.",
        );

        this.saving.set(false);
      },
    });
  }

  saveTrade(): void {
    this.submit("trades", {
      ...this.trade,
      occurredAt: this.trade.occurredAt + ":00",
      expectedAmount: this.trade.quantity * this.trade.unitPrice,
      items: [
        {
          productId: this.trade.productId,
          quantity: this.trade.quantity,
          unitPrice: this.trade.unitPrice,
        },
      ],
    });
  }

  saveGang(): void {
    this.submit("gangs", this.gang);
  }

  changeRelationship(g: Row, relationship: string): void {
    if (
      !confirm("Change " + g.name + " relationship to " + relationship + "?")
    ) {
      return;
    }

    this.submit("gangs/" + g.id + "/relationship", {
      relationship,
      effectiveFrom: this.now() + ":00",
      notes: "Updated in Cashflow",
    });
  }

  savePrice(): void {
    this.submit("prices", this.price);
  }

  saveCleaning(): void {
    this.submit("cleanings", {
      ...this.clean,
      occurredAt: this.clean.occurredAt + ":00",
    });
  }

  saveAdjustment(): void {
    this.submit("adjustments", this.adjustment);
  }

  voidRecord(kind: string, id: number): void {
    const reason = prompt("Reason for voiding (minimum 8 characters):");

    if (!reason) {
      return;
    }

    this.submit(kind + "/" + id + "/void", { reason });
  }

  exportCsv(name: string, rows: Row[]): void {
    if (!rows.length) {
      this.error.set("No rows to export.");
      return;
    }

    const keys = Object.keys(rows[0]);

    const escape = (v: any): string =>
      '"' +
      String(v ?? "")
        .replace(/"/g, '""')
        .replace(/^[=+@-]/, "'$&") +
      '"';

    const csv = [
      keys.map(escape).join(","),
      ...rows.map((r) => keys.map((k) => escape(r[k])).join(",")),
    ].join("\r\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );

    const link = document.createElement("a");

    link.href = url;
    link.download = "odins-" + name + ".csv";

    link.click();

    URL.revokeObjectURL(url);
  }
}
