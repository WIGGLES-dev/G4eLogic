<script>
  import { getContext } from "svelte";
  import { createTooltip } from "@ui/utils/popper";

  const { character } = getContext("app");
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
        class="fas fa-dice-d6 hover:text-red-700 pr-1" />{$character.getSwingDamage()}</span>
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
        class="fas fa-dice-d6 hover:text-red-700 pr-1" />{$character.getThrustDamage()}</span>
  </div>
</section>
