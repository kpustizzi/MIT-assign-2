/* Preset educational examples. This prototype does not connect to an AI service. */
const examples = {
  sale: {
    text: 'We sold a bicycle to a customer for $1,000 cash.',
    debit: 'Cash', credit: 'Sales Revenue', amount: '$1,000',
    explanation: 'Cash is debited because the business received $1,000 in cash. Sales Revenue is credited because the business earned $1,000 from the sale.'
  },
  supplies: {
    text: 'We purchased $500 of office supplies for cash.',
    debit: 'Office Supplies', credit: 'Cash', amount: '$500',
    explanation: 'Office Supplies is debited because the business acquired $500 of supplies. Cash is credited because the business paid $500. This example assumes the supplies are an asset to be used later; they are expensed as they are used.'
  },
  wages: {
    text: 'We paid an employee $1,200 in wages.',
    debit: 'Wages Expense', credit: 'Cash', amount: '$1,200',
    explanation: 'Wages Expense is debited to record $1,200 earned by the employee. Cash is credited because the business paid $1,200. This simplified example assumes no previously recorded wages payable and excludes payroll taxes and withholdings.'
  },
  loan: {
    text: 'We received a $10,000 business loan and the money was deposited into our bank account.',
    debit: 'Cash', credit: 'Loan Payable', amount: '$10,000',
    explanation: 'Cash is debited because the business received $10,000 in its bank account. Loan Payable is credited because the business now owes $10,000 to the lender. Borrowed money is a liability, not sales revenue.'
  }
};

const input = document.querySelector('#transaction');
const results = document.querySelector('#results');
const message = document.querySelector('#form-message');
const exampleButtons = document.querySelectorAll('[data-example]');
const initialText = input.value;

/* Selecting a sample clears the old answer so it cannot be mistaken for a new one. */
exampleButtons.forEach((button) => {
  button.setAttribute('aria-pressed', String(button.dataset.example === 'sale'));
  button.addEventListener('click', () => {
    input.value = examples[button.dataset.example].text;
    exampleButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    results.hidden = true;
    message.textContent = 'Example ready. Select Get Answer to see its accounting entry.';
    input.focus();
  });
});

input.addEventListener('input', () => {
  results.hidden = true;
  message.textContent = '';
  exampleButtons.forEach((button) => {
    button.classList.remove('selected');
    button.setAttribute('aria-pressed', 'false');
  });
});

/* Only exact preset transactions are supported; never invent an answer for arbitrary input. */
const normalize = (text) => text.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
document.querySelector('#transaction-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const text = normalize(input.value);
  const key = text === normalize(initialText) ? 'sale' : Object.keys(examples).find((name) => normalize(examples[name].text) === text);
  if (!key) {
    results.hidden = true;
    message.textContent = 'This demo supports the four example transactions above. Choose an example, then select Get Answer to see a preset entry.';
    return;
  }
  const example = examples[key];
  const rows = document.querySelector('#entry-rows');
  rows.replaceChildren();
  [[example.debit, example.amount, ''], [example.credit, '', example.amount]].forEach((values) => {
    const row = document.createElement('tr');
    values.forEach((value, index) => {
      const cell = document.createElement(index === 0 ? 'th' : 'td');
      if (index === 0) cell.scope = 'row';
      cell.textContent = value;
      row.appendChild(cell);
    });
    rows.appendChild(row);
  });
  document.querySelector('#debit-total').textContent = example.amount;
  document.querySelector('#credit-total').textContent = example.amount;
  document.querySelector('#explanation-text').textContent = example.explanation;
  document.querySelector('#inventory').hidden = key !== 'sale';
  results.hidden = false;
  message.textContent = 'Your example entry is ready below.';
  document.querySelector('#results-heading').focus({ preventScroll: true });
  results.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
});

/* Mobile navigation closes after selecting a destination. */
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('is-open', expanded);
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}));

/* Local informational dialogs keep all prototype links useful without a backend. */
const dialogContent = {
  signin: ['Sign In', 'LedgerLift AI is an educational prototype. Accounts and sign-in are not available. You can use the example assistant for free without creating an account.'],
  plan: ['Small Business Plan', 'This $19/month plan illustrates a future product. Subscriptions, saved history, and unlimited AI assistance are not available in this prototype. Explore the free example assistant on this page.'],
  privacy: ['Privacy', 'This page does not send your transaction text to a server or save it in browser storage. It uses no analytics, external fonts, or third-party services. Your edits are temporary and reset when you reload the page.'],
  terms: ['Terms', 'LedgerLift AI is a fictional educational demonstration. Examples are simplified learning aids and are not professional accounting, tax, or financial advice. No paid services are provided.'],
  contact: ['Contact', 'LedgerLift AI is a fictional product and has no customer support team. For questions about this educational project, contact the person who shared it with you.']
};
const dialog = document.querySelector('#info-dialog');
document.querySelectorAll('[data-dialog]').forEach((button) => button.addEventListener('click', () => {
  const [title, text] = dialogContent[button.dataset.dialog];
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#dialog-text').textContent = text;
  dialog.showModal();
}));
