import { Change } from "textdiff-create";

/**
 * An edit to a document. The change itself is a diff from textdiff-create, and
 * we also store the timestamp of the edit.
 */
export interface Edit {
  /** The actual change, as a diff */
  changes: Change[];
  /** The timestamp of the edit, in epoch seconds */
  timestamp: number;
}

/**
 * A stack of edits in a document memory. Each stack represents an older stage
 * of the memory and has pointer the next, even, older, one. So, the freshest
 * edits are in the first stack. Every time that fills once, a  combnined edit
 * isadded to the next stack, recursively.
 */
export interface Stack {
  /** The edits in this stack. Will always have length == period of the parent
   * memory
   */
  edits: Array<Edit | null>;
  /**
   * The state of the document the last time this stack was pushed to. We store
   * this so that we can calculate a diff when a new state comes in. The
   * alternative being to store reversible diffs, i.e. diffs that contain the
   * actual text from deletions so they can be reversed, which could make diffs
   * very large if there are lots of large changes.
   * XXX can we do anything cleverer?
   */
  // lastPushSnapshot: string;
  /**
   * The state of the document the last time this stack pushed down to the
   * next stack.
   */
  bombBay: Change[];
  /**
   * A pointer to the next stack, to which we will dump edits every time we have
   * recorded `period` edits.
   */
  next: Stack | null;
}

/**
 * A document's edit memory. Older edits are stored with less granularity.
 */
export interface DocumentMemory {
  /**
   * A pointer to the first stack in the memory, the one which will contain the
   * most recent edits.
   */
  stack: Stack;
  /**
   * The curent serial number.
   */
  serial: number;
  /**
   * The period of this memory, i.e. how many edits are stored in each stack.
   */
  period: number;
  /**
   * Limit on maximum depth of stacks. The total number of edits stored will be
   * period * maxDepth, representing
   * period^maxDepth + period^(maxDepth - 1) + ... + period^1
   * total edits.
   */
  maxDepth: number | null;
  /**
   * A snapshot of the most recent state of the document
   */
  state: string;
  /**
   * a cache of snapshots of each level of the document
   */
  snapshots: string[];
}
