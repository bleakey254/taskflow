import { testAction } from '@/actions/test';

export default function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <form action={testAction}>
        <button type="submit">Test</button>
      </form>
    </div>
  );
}