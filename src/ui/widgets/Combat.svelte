<script>
  import { getContext } from "svelte";
  import { createTooltip } from "@ui/utils/popper";

  const { character } = getContext("editor");
  const { swingDamage$, thrustDamage$ } = character;
</script>

<style>
  :global(.damage-table) {
    @apply text-center;
  }
  :global(.damage-table td) {
    @apply border border-white border-solid px-1;
  }
</style>

<section>
  <div class="flex mb-2">
    <label
      use:createTooltip={{ tipclass: 'text-sm', tooltip: `
      Size Modifier is a general measurement of a target's size. Humans have SM 0; larger or smaller creatures follow the Size and Speed/Range table (Ref. BS19).</br>

      <strong>Character Creation</strong>
          <BLOCKQUOTE>
            <strong>Strength: </strong>If you have positive SM, reduce the cost of ST (Ref. BS14) and HP (Ref. BS16) by -10% * SM (max. -80%).</br>
          </BLOCKQUOTE>
      
      <strong>Combat Rules</strong>
          <BLOCKQUOTE>
            <strong>Large Area Injury:</strong> If you are 7 or more SM larger than a target, your attacks are large-area injury (Ref. BS400).</br>
            <strong>Reach:</strong> If you have SM+1, C weapons gain 1 Reach. Otherwise, consult the Size and Speed/Range table (Ref. BS402).</br>
            <strong>To Grapple:</strong> You receive the difference in SM as a modifier to your to-hit rolls for a grapple (Ref. BS402).</br>
            <strong>To Hit:</strong> You receive the difference in SM as a negative modifier to your to-hit rolls for an attack (Ref. BS550).</br>
            <strong>To Pin:</strong> You receive the difference in SM * 3 as a modifier to your pin rolls (Ref. BS370).</br>
          </BLOCKQUOTE>
      
      <strong>Other Rules</strong>
          <BLOCKQUOTE>
            <strong>Intimidation:</strong> You receive the difference in SM as a modifier to your Intimidation roll. (Ref. BS202)</br>
            <strong>Spell Cost:</strong> If your SM is positive, spells cost is multiplied by (1 + SM) (Ref. BS239).</br>
            <strong>Vision:</strong> You receive the difference in SM as a modifier to being seen (Ref. BS358).</br>
          </BLOCKQUOTE>
      
      For more information, see <strong>tinyurl.com/SizeModifier</strong> for Bruno's list of size modifier effects.
    ` }}
      class="w-1/2 underline text-center font-semibold"
      for="">
      Size
    </label>
    <div class="flex w-1/2">
      <input
        bind:value={$character.sizeModifier}
        placeholder="0"
        class="w-12 outline-none border-b border-solid border-red-700 rounded-r-md text-center"
        type="number" />
    </div>
  </div>
  <div
    class="flex"
    use:createTooltip={{ tipclass: 'text-sm', tooltip: `
  Swing Damage. Based on Striking Strength. Ref. BS16.<br/>
	<table class="damage-table">
<thead>
  <tr>
    <th>Strength</th>
    <th>Value</th>
    <th>Strength</th>
    <th>Value</th>
    <th>Strength</th>
    <th>Value</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>1</td>
    <td>1d6-5</td>
    <td>11</td>
    <td>1d6+1</td>
    <td>21</td>
    <td>4d6-1</td>
  </tr>
  <tr>
    <td>2</td>
    <td>1d6-5</td>
    <td>12</td>
    <td>1d6+2</td>
    <td>22</td>
    <td>4d6</td>
  </tr>
  <tr>
    <td>3</td>
    <td>1d6-4</td>
    <td>13</td>
    <td>2d6-1</td>
    <td>23</td>
    <td>4d6+1</td>
  </tr>
  <tr>
    <td>4</td>
    <td>1d6-4</td>
    <td>14</td>
    <td>2d6</td>
    <td>24</td>
    <td>4d6+2</td>
  </tr>
  <tr>
    <td>5</td>
    <td>1d6-3</td>
    <td>15</td>
    <td>2d6+1</td>
    <td>25</td>
    <td>5d6-1</td>
  </tr>
  <tr>
    <td>6</td>
    <td>1d6-3</td>
    <td>16</td>
    <td>2d6+2</td>
    <td>26</td>
    <td>5d6</td>
  </tr>
  <tr>
    <td>7</td>
    <td>1d6-2</td>
    <td>17</td>
    <td>3d6-1</td>
    <td>27</td>
    <td>5d6+1</td>
  </tr>
  <tr>
    <td>8</td>
    <td>1d6-2</td>
    <td>18</td>
    <td>3d6</td>
    <td>28</td>
    <td>5d6+1</td>
  </tr>
  <tr>
    <td>9</td>
    <td>1d6-1</td>
    <td>19</td>
    <td>3d6+1</td>
    <td>29</td>
    <td>5d6+2</td>
  </tr>
  <tr>
    <td>10</td>
    <td>1d6</td>
    <td>20</td>
    <td>3d6+2</td>
    <td>30</td>
    <td>5d6+2</td>
  </tr>
</tbody>
</table>
  ` }}>
    <span class="flex-1 text-center font-semibold">Swing </span>
    <span class="flex-1">
      <span
        class="fas fa-dice-d6 hover:text-red-700 pr-1" />{$swingDamage$}</span>
  </div>
  <div
    class="flex"
    use:createTooltip={{ tipclass: 'text-sm', tooltip: `
  Thrust Damage. Based on Striking Strength. Ref. BS16.<br/>
	<table class="damage-table">
<thead>
  <tr>
    <th><strong>Strength</strong></th>
    <th><strong>Value</strong></th>
    <th><strong>Strength</strong></th>
    <th><strong>Value</strong></th>
    <th><strong>Strength</strong></th>
    <th><strong>Value</strong></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>1</td>
    <td>1d6-6</td>
    <td>11</td>
    <td>1d6-1</td>
    <td>21</td>
    <td>2d6</td>
  </tr>
  <tr>
    <td>2</td>
    <td>1d6-6</td>
    <td>12</td>
    <td>1d6-1</td>
    <td>22</td>
    <td>2d6</td>
  </tr>
  <tr>
    <td>3</td>
    <td>1d6-5</td>
    <td>13</td>
    <td>1d6</td>
    <td>23</td>
    <td>2d6+1</td>
  </tr>
  <tr>
    <td>4</td>
    <td>1d6-5</td>
    <td>14</td>
    <td>1d6</td>
    <td>24</td>
    <td>2d6+1</td>
  </tr>
  <tr>
    <td>5</td>
    <td>1d6-4</td>
    <td>15</td>
    <td>1d6+1</td>
    <td>25</td>
    <td>2d6+2</td>
  </tr>
  <tr>
    <td>6</td>
    <td>1d6-4</td>
    <td>16</td>
    <td>1d6+1</td>
    <td>26</td>
    <td>2d6+2</td>
  </tr>
  <tr>
    <td>7</td>
    <td>1d6-3</td>
    <td>17</td>
    <td>1d6+2</td>
    <td>27</td>
    <td>3d6-1</td>
  </tr>
  <tr>
    <td>8</td>
    <td>1d6-3</td>
    <td>18</td>
    <td>1d6+2</td>
    <td>28</td>
    <td>3d6-1</td>
  </tr>
  <tr>
    <td>9</td>
    <td>1d6-2</td>
    <td>19</td>
    <td>2d6-1</td>
    <td>29</td>
    <td>3d6</td>
  </tr>
  <tr>
    <td>10</td>
    <td>1d6-2</td>
    <td>20</td>
    <td>2d6-1</td>
    <td>30</td>
    <td>3d6</td>
  </tr>
</tbody>
</table
>` }}>
    <span class="flex-1 text-center font-semibold">Thrust </span>
    <span class="flex-1">
      <span
        class="fas fa-dice-d6 hover:text-red-700 pr-1" />{$thrustDamage$}</span>
  </div>
</section>
